const express = require("express");
const path = require("path");
const fsp = require("fs/promises");
const suid = require("short-unique-id");
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
  console.info(`${req.method} request received to add a note.`);
  const { title, text } = req.body;

  if (title && text) {
    let noteID = new suid();
    const newNote = {
      title,
      text,
      id: noteID.rnd(),
    };

    fsp
      .readFile("./db/db.json", "utf8")
      .then((data) => {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        return fsp.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4)
        );
      })
      .then(console.log("Notes updated successfully!"))
      .catch((error) => {
        console.error(`Error in updating notes: ${error}`);
      });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error: Unable to post note.");
  }
});
app.delete("/api/notes/:id", (req, res) => {
  console.info(
    `Request received to ${req.method} note with id ${req.params.id}.`
  );
  fsp
    .readFile("./db/db.json", "utf8")
    .then((data) => {
      const parsedNotes = JSON.parse(data);
      if (!parsedNotes.some((note) => note.id === req.params.id)) {
        res.status(400).json(`Error: No note with id ${req.params.id} found.`);
        return;
      } else {
        const filteredNotes = parsedNotes.filter(
          (note) => note.id !== req.params.id
        );
        return fsp.writeFile(
          "./db/db.json",
          JSON.stringify(filteredNotes, null, 4)
        );
      }
    })
    .then(console.log("Notes updated successfully!"))
    .catch((error) => {
      console.error(`Error in updating notes: ${error}`);
    });

  const response = {
    status: "success",
    body: "",
  };

  console.log(response);
  res.status(204).json(response);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
// [{"title": "Title","text": "Text"}]
