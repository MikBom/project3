// Let's take express module in use
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

/* Let's take env parameters in use */
require("dotenv").config();

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set userid and pw. To be set in Atlas pages
var user = process.env.MONGO_USERID
var pw = process.env.MONGO_PW

// Let's ake mongoose module in use
var mongoose = require("mongoose");
var uri =
    "mongodb+srv://" + user + ":" + pw + "@cluster0.ge7fr.mongodb.net/sample_mflix";


// Connecting to database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define User-Schema, it is datamodel from objects to be save into table
const Movie = mongoose.model(
    "Movie",
    {
        title: String,
        year: Number,
        poster: String,
    },
    "movies"
);

//View mode for ejs
app.set("view engine", "ejs");

//Material from the public folder
app.use(express.static("./public"));

// Routes and functions
//index page
app.get("/", function (req, res) {
    var data = {
        heading: "Main page",
        text: "Let's try something.",
        whichpage: "Main page",
    }
    res.render("pages/index", data);
});
// Show all movies
app.get("/api/getall", function (req, res) {
    Movie.find({}, null, { limit: 10 }, function (err, results) {
        console.log(results);
        res.json(results, 200);
    });
});
app.get("/api/:id", function (req, res) {
    Movie.find({}, null, { limit: 10 }, function (err, results) {
        console.log(results);
        res.json(results, 200);
    });
});

// Return one movie with ID
app.post("/api/add", function (req, res) {
    console.log(req.body);
    res.send("Let's add movie: " + req.body.title + " (" + req.body.year + ")");
});

// Modify movies base to id
app.put("/api/update/:id", function (req, res) {
    res.send("Let's modify file with ID: " + req.params.id);
});

// Remove movie base to id
app.delete("/api/delete/:id", function (req, res) {
    // pick up id and deliver it to data
    var id = req.params.id;

    Movie.findByIdAndDelete(id, function (err, results) {
        if (err) {
            console.log(err);
            res.json("Mistake in the system.", 500);
        } else if (results == null) {
            res.json("There was nothing to remove.", 200);
        } else {
            console.log(results);
            res.json("Deleted " + id + " " + results.title, 200);
        }
    });
});

//If not correct page writed then it gives warning 
app.get("*", function (req, res) {
    res.status(404).send("Page can't be found, go back from <a href = '/'>here</a>");
});

// Create web-server with express
app.listen(3000, function () {
    console.log(" You are listening port 3000!");
});