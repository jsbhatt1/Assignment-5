const Sequelize = require('sequelize');
var sequelize = new Sequelize('d524a0cd5cecnh', 'ucu5uqpd90ea6r', 'pa51119a3edcd746e2ae7892fce80815052d6c971ce8aa402e5bfb12fb8b23eb9', {
    host: 'cd5gks8n4kb20g.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
});

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: 'course' });

function initialize () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        });
    });
};

function getAllStudents () {
    return new Promise((resolve, reject) => {
        Student.findAll().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

function getCourses () {
    return new Promise((resolve, reject) => {
        Course.findAll().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

function getStudentsByCourse (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                course: course
            }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

function getStudentByNum (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

function getCourseById (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: {
                courseId: id
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

function addStudent (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") {
            studentData[prop] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Student.create(studentData).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create student");
        });
    });
};

function updateStudent (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") {
            studentData[prop] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to update student");
        });
    });
};

function addCourse (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") {
            courseData[prop] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Course.create(courseData).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create course");
        });
    });
};

function updateCourse (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") {
            courseData[prop] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to update course");
        });
    });
};

function deleteCourseById (id) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: { courseId: id }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to Remove Course / Course not found");
        });
    });
};

function deleteStudentByNum (studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to Remove Student / Student not found");
        });
    });
};

module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    getCourseById,
    addStudent,
    updateStudent,
    addCourse,
    updateCourse,
    deleteCourseById,
    deleteStudentByNum
};
