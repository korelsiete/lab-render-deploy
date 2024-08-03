const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
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

notesRouter.post("/", (req, res, next) => {
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

notesRouter.put("/:id", (req, res, next) => {
  const note = req.body;

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => res.json(updatedNote))
    .catch((err) => next(err));
});

notesRouter.delete("/:id", (req, res) => {
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

module.exports = notesRouter;
