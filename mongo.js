const mongoose = require("mongoose");
const argsLength = process.argv.length;

if (argsLength < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [password, content, important] = process.argv.slice(2);

const url = `mongodb+srv://korelsiete:${password}@fsopen.y27rp5g.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fsopen`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

if (argsLength === 3) {
  Note.find({}).then((notes) => {
    console.log("notes:");
    notes.forEach((note) => {
      console.log(note.content, note.important);
    });
    mongoose.connection.close();
  });
}

if (argsLength > 3) {
  if (!important) {
    console.log("important argument missing");
    process.exit(1);
  }

  const note = new Note({
    content,
    important,
  });

  note
    .save()
    .then(() => {
      console.log(`note saved: ${note.content}, ${note.important}`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
}
