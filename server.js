/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jayshivam Sanatbhai Bhatt | Student ID: 150464238 (Seneca ID: jsbhatt1) | Date: July 25, 2024
*
* Online (Heroku) Link: https://limitless-wildwood-31904-e0b0aefec959.herokuapp.com/
*
********************************************************************************/


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const collegeData = require('./modules/collegeData');
const students = require('./data/students')
const courses = require('./data/courses')
const exphbs = require('express-handlebars');

const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      navLink: function(url, options) {
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      }
    }
});  

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get('/students', (req, res) => {
    if (students.length > 0) {
      res.render('students', { students });
    } else {
      res.render('students', { message: "no results" });
    }
});

app.get('/courses', (req, res) => {
    if (courses.length > 0) {
      res.render('courses', { courses });
    } else {
      res.render('courses', { message: "no results" });
    }
});

app.get('/course/:id', (req, res) => {
    collegeData.getCourseById(req.params.id)
      .then((data) => {
        res.render('course', { course: data });
      })
      .catch((err) => {
        res.render('course', { message: "query returned 0 results" });
      });
});

app.get('/student/:num', (req, res) => {
    let viewData = {};
    collegeData.getStudentByNum(Number(req.params.num)).then((data) => {
        
        if (data) {
            viewData.student = data; // storing the data into "viewData" object
        } else {
            viewData.student = null;
        }

    }).catch(() => {
        viewData.student = null;

    }).then(collegeData.getCourses)
    .then((data) => {
        viewData.courses = data;
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.courses = [];
        
    }).then(() => {
        if (viewData.student == null) {
            res.status(404).send("Student Not Found");     // if no student - return an error
        } else {
            res.render("student", { viewData: viewData });
        }
    });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/student"))
        .catch(err => res.send(err));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect('/students'))
        .catch(err => res.send(err));
});

app.get('/', (req, res) => {
    res.render('home');
});  

app.get('/about', (req, res) => {
    res.render('about');
});  

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo');
});  

app.get('/students/add', (req, res) => {
    res.render('addStudent');
});

app.use((req, res) => {         // Handling the error
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});

collegeData.initialize()        // Initializing the server
    .then(() => {
        app.listen(HTTP_PORT, ()=>{console.log("Server is running on port: " + HTTP_PORT);});
    })
    .catch(err => {
        console.error('Failed to initialize data:', err);
    });