//Here to link the other files together
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const db = require("./db/db.json");

// Server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Static Middware
//app.use(express.static("public"));

//api Route GET
app.get("/api/notes", function(req, res) {
    console.log("api get route");
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        console.log(data);
        notes =[].concat(JSON.parse(data))
        console.log(notes);
        res.json(notes);
    })
});

//API Route "POST
app.post("/api/notes", function(req, res) {
    const note =req.body;
    console.log(note);
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        console.log(data);
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes) {
        console.log(notes);
       fs.writeFileSync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

// API Route "DELETE"
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
            if(idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function(notes) {
        fs.writeFileSync("./db/db.json", JSON.stringify(notes))
        res.send('saved success!!!');
    })
})

//HTML Route
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Listening.
//app.listen(PORT, function() {
    //console.log("app listening on PORT" + PORT);
//});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
  