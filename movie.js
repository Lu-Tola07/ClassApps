const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = 2022;

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
const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        require: [true, "Name is required."]
    },
    movieGenre: {
        type: String,
        require: [true, "Genre is required."]
    },
    movieYear: {
        type: Number,
        require: [true, "Year is required."]
    },
    movieIndustry: {
        type: String,
        require: [true, "Industry is required."]
    }
}, {timestamps: true});

// Create a model
const movieModel = mongoose.model("movie", movieSchema);

// Performing CRUD functionality
app.post("/create", async(req, res) => {
    const newMovie = await movieModel.create(req.body);
    if(newMovie) { 
        res.status(201).json({
            message: "New movie created successfully.",
            data: newMovie
        })
    }
});

app.get("/allmovies", async (req, res) => {
   try {
        const allMovies = await movieModel.find();
        if(allMovies.length === 0) {
            res.status(200).json({
            message: `There are currently no movie in this database.`
        })
    } else {
        res.status(200).json({
            message: `List of movies in this datatbase. Total number is ${allMovies.length}.`,
            data: allMovies
        })
    }
   } catch (error) {
    res.satus(500).json({
        message: error.message
    })
   }
})



app.get("/movie/:id", async(req, res) => {
    const movieId = req.params.id;
    if(!movieId) {
        res.status(404).json({
            message: `Movie with id: ${movieId} not found.`
        })
    }else {
        const movie = await movieModel.findById(movieId);
        res.status(200).json({
        message: `The movie with id: ${movieId} has been found.`,
        data: movie
    })
    }
});

app.put("/movie/:id", async(req, res) => {
    const movieId = req.params.id;
    if(!movieId) {
        res.status(404).json({
            message: `The movie with id: ${movieId} not found.`
        })
    }else {
        const movie = await movieModel.findByIdAndUpdate(movieId, req.body, {new: true});
        res.status(200).json({
            message: `The movie with id: ${movieId} has been updated.`,
            data: movie
    })
    }
});