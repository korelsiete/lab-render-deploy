require("dotenv").config();
const express = require("express");
const Note = require("./models/note.js");
const cors = require("cors");
const app = express();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const requestLogger = (req, res, next) => {
  console.log(`${req.method} | "${req.path}"`);
  console.log(req.body);
  console.log("----");
  next();
};

function generateId(notes = []) {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
}

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      res.json(note);
    })
    .catch(() => {
      res.status(404).json({ error: "note not found" });
    });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (!note) {
    return res.status(404).json({ error: "note not found" });
  }

  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((noteSaved) => {
    res.json(noteSaved);
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
