const fs = require('fs');
const path = require('path');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../data/students.json'), 'utf8', (err, studentsData) => {
            if (err) {
                reject('Unable to read students file');
                return;
            }

            fs.readFile(path.join(__dirname, '../data/courses.json'), 'utf8', (err, coursesData) => {
                if (err) {
                    reject('Unable to read courses file');
                    return;
                }

                const students = JSON.parse(studentsData);
                const courses = JSON.parse(coursesData);

                dataCollection = new Data(students, courses);
                resolve('Data successfully initialized');
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students) {
            if (dataCollection.students.length > 0) {
                resolve(dataCollection.students);
            } else {
                reject('No results returned');
            }
        } else {
            reject('No students data found');
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses) {
            if (dataCollection.courses.length > 0) {
                resolve(dataCollection.courses);
            } else {
                reject('No results returned');
            }
        } else {
            reject('No courses data found');
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students) {
            const studentsByCourse = dataCollection.students.filter(student => student.course === course);
            if (studentsByCourse.length > 0) {
                resolve(studentsByCourse);
            } else {
                reject('No results returned');
            }
        } else {
            reject('No students data found');
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students) {
            const student = dataCollection.students.find(student => student.studentNum === num);
            if (student) {
                resolve(student);
            } else {
                reject('No results returned');
            }
        } else {
            reject('No students data found');
        }
    });
}

function getCourseById (id) {
    return new Promise((resolve, reject) => {
      const course = dataCollection.courses.find(c => c.courseId == id);
      if (course) {
        resolve(course);
      } else {
        reject("query returned 0 results");
      }
    });
};

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        if (!studentData) {
            reject("Invalid student data");
        } else {
            studentData.TA = studentData.TA === 'true';
            studentData.studentNum = dataCollection.students.length + 1;
            dataCollection.students.push(studentData);
            
            fs.writeFile('./data/students.json', JSON.stringify(dataCollection), (err) => {
                if (err) {
                    reject("Failed to add student");
                } else {
                    resolve();
                }
            });
        }
    });
};

function updateStudent (studentData) {
    return new Promise((resolve, reject) => {
        const index = students.findIndex(s => s.studentNum == studentData.studentNum);
        if (index !== -1) {
            students[index] = studentData;
            resolve();
        } else {
            reject("Student not found");
        }
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
    updateStudent
};
