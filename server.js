/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jayshivam Sanatbhai Bhatt | Student ID: 150464238 (Seneca ID: jsbhatt1) | Date: August, 1 2024
*
* Online (Heroku) Link: https://limitless-wildwood-31904-e0b0aefec959.herokuapp.com/
*
********************************************************************************/


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const collegeData = require('./modules/collegeData');
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
    collegeData.getAllStudents().then((students) => {
        if (students.length > 0) {
            res.render('students', { students: students });
        } else {
            res.render('students', { message: "no results" });
        }
    }).catch(() => {
        res.render('students', { message: "no results" });
    });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then((courses) => {
        if (courses.length > 0) {
            res.render('courses', { courses: courses });
        } else {
            res.render('courses', { message: "no results" });
        }
    }).catch(() => {
        res.render('courses', { message: "no results" });
    });
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

app.get("/student/:studentNum", (req, res) => {
    let viewData = {};

    data.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data;
        } else {
            viewData.student = null;
        }
    }).catch(() => {
        viewData.student = null;
    }).then(data.getCourses).then((data) => {
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
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData });
        }
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
    data.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect("/students");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Student / Student not found");
    });
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

app.get("/students/add", (req, res) => {
    data.getCourses().then((data) => {
        res.render("addStudent", { courses: data });
    }).catch(() => {
        res.render("addStudent", { courses: [] });
    });
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.get("/course/delete/:id", (req, res) => {
    data.deleteCourseById(req.params.id).then(() => {
        res.redirect("/courses");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Course / Course not found");
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

app.post("/courses/add", (req, res) => {
    data.addCourse(req.body).then(() => {
        res.redirect("/courses");
    }).catch((err) => {
        res.status(500).send("Unable to Add Course");
    });
});

app.post("/course/update", (req, res) => {
    data.updateCourse(req.body).then(() => {
        res.redirect("/courses");
    }).catch((err) => {
        res.status(500).send("Unable to Update Course");
    });
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
