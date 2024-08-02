require("dotenv").config();
const express = require("express");
const Note = require("./models/note.js");
const cors = require("cors");
const app = express();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const logger = (req, res, next) => {
  console.log("------------------------------------");
  console.log(`Method: ${req.method}`);
  console.log(`Path: "${req.path}"`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error("Error: ===> " + error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(logger);

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: "note not found" });
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then((noteDeleted) => {
      if (noteDeleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "note not found" });
      }
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((noteSaved) => res.json(noteSaved))
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  const note = req.body;

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => res.json(updatedNote))
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
