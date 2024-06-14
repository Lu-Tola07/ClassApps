const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = 2024;

// Create a mongoDB connection string
// const databaseUrl = "mongodb://localhost:27017/studentDB"
const databaseUrl = process.env.DATABASE


// Connect to the database(compass)
mongoose.connect(databaseUrl)
.then(() => {
    console.log(`Successfully connected to the database.`)
})
.catch((error) => {
    console.log(error.message)
});

// Create an instance of express module imported
const app = express();
app.use(express.json());

// Connect application to listen to the port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});


// Create a schema
const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        require: [true, "Name is required."]
    },
    studentCourse: {
        type: String,
        require: [true, "Name is required."]
    },
    studentScore: {
        type: Number,
        require: [true, "Score is required."]
    }
}, {timestamps: true});

// Create a model
const studentModel = mongoose.model("student", studentSchema);

// Performing CRUD functionality
app.post("/myStudent", async(req, res) => {
    const newStudent = await studentModel.create(req.body);
    // const {studentName, studentCourse, studentScore} = req.body;
    if(newStudent) {
        res.status(201).json({
            message: "New student created successfully.",
            data: newStudent
        })
    }
});

// Show all students created
app.get("/myStudent", async(req, res) => {
    const students = await studentModel.find();
    if(!students || students.length <=0) {
        res.status(404).json({
            message: "No student found."
        })
    }
    res.status(200).json({
        message: "All available students.",
        data: students
    })
})

// Show a student
app.get("/myStudent/:id", async(req, res) => {
    const studentId = req.params.id;
    if(!studentId) {
        res.status(404).json({
            message: `Student with id: ${studentId} not found.`
        })
    }else {
        const student = await studentModel.findById(studentId);
        res.status(200).json({
        message: `Student with id: ${studentId} found.`,
        data: student
    })
    }
});

// Delete a student
app.delete("/myStudent/:id", async(req, res) => {
    const studentId = req.params.id;
    if(!studentId) {
        res.status(404).json({
            message: `Student with id: ${studentId} not found.`
        })
    }else {
        const student = await studentModel.findByIdAndDelete(studentId);
        res.status(200).json({
        message: `Student with id: ${studentId} has been deleted.`,
        data: student
    })
    }
});

// To update a student
app.put("/myStudent/:id", async(req, res) => {
    // const (studentName, studentCourse, studentScore)
    const studentId = req.params.id;
    if(!studentId) {
        res.status(404).json({
            message: `Student with id: ${studentId} not found.`
        })
    }else {
        // const student = await studentModel.findByIdAndUpdate(studentId, {
        //     studentName: req.body.studentName || student.studentName,
        //     studentCourse: req.body.studentCourse || student.studentCourse,
        //     studentScore: req.body.studentScore || student.studentScore,
        // }, {new: true});
        const student = await studentModel.findByIdAndUpdate(studentId, req.body, {new: true});
        res.status(200).json({
            message: `Student with id: ${studentId} has been updated.`,
            data: student
    })
    }
});

