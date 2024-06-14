const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = 2044;

const databaseUrl = process.env.DATABASE

mongoose.connect(databaseUrl)
.then(() => {
    console.log(`Successfully connected to the database.`)
})
.catch((error) => {
    console.log(error.message)
});

const app = express();
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});


// Create a schema
const footballSchema = mongoose.Schema({
    footballer: {
        type: String,
        require: [true, "Name is required."]
    },
    team: {
        type: String,
        require: [true, "Name is required."]
    },
    age: {
        type: Number,
        require: [true, "Number is required."]
    },
    country: {
        type: String,
        require: [true, "Name is required."]
    }
})

const footballModel = mongoose.model("footballer", footballSchema);

app.post("/theFootballer", async(req, res) => {
    const newFootballer = await footballModel.create(req.body);
    if(newFootballer) {
        res.status(201).json({
            message: "A new player has been created successfully.",
            data: newFootballer
        })
    }
});

app.get("/theFootballer", async(req, res) => {
    const footballers = await footballModel.find();
    if(!footballers || footballers.length <=0) {
        res.status(404).json({
            message: "No footballer found."
        })
    }
    res.status(200).json({
        message: "Here are all the available footballers.",
        data: footballers
    })
})

app.get("/theFootballer/:id", async(req, res) => {
    const footballerId = req.params.id;
    if(!footballerId) {
        res.status(404).json({
            message: `Footballer with id: ${footballerId} not found.`
        })
    }else {
        const footballer = await footballModel.findById(footballerId);
        res.status(200).json({
        message: `The footballer with id: ${footballerId} has been found.`,
        data: footballer
    })
    }
});

app.delete("/theFootballer/:id", async(req, res) => {
    const footballerId = req.params.id;
    if(!footballerId) {
        res.status(404).json({
            message: `Footballer with id: ${studentId} not found.`
        })
    }else {
        const footballer = await footballModel.findByIdAndDelete(footballerId);
        res.status(200).json({
        message: `The player with id: ${footballerId} has been deleted.`,
        data: footballer
    })
    }
});

app.put("/theFootballer/:id", async(req, res) => {
    const footballerId = req.params.id;
    if(!footballerId) {
        res.status(404).json({
            message: `Player with id: ${footballerId} not found.`
        })
    }else {
        const footballer = await footballModel.findByIdAndUpdate(footballerId, req.body, {new: true});
        res.status(200).json({
            message: `The player with id: ${footballerId} has been updated.`,
            data: footballer
    })
    }
});

