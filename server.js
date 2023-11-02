const express = require("express");
const path = require("path");
const fs = require("fs")
const notes = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// HTML routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(notes));
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note.`)
    const {title, text} = req.body;

    if (title) {
        const newNote = {
            title,
            text: text || "",
            note_id
        }
    }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
