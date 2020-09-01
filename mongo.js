const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://user1:${password}@cluster0.ch8li.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});


noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
    content: "HTML is Easy",
    date: new Date(),
    important: true,
});

note.save().then((result) => {
    console.log("note saved!");
    mongoose.connection.close();
});

//מדפיס את כל האובייקטים
// Note.find({}).then((result) => {
//     result.forEach((note) => {
//         console.log(note);
//     });
//     mongoose.connection.close();
// });

//מדפיס רק את האובייקטים שעומדים בתנאי
// Note.find({ important: true }).then((result) => {
//     result.forEach((note) => {
//         console.log(note);
//     });
//     mongoose.connection.close();
// });
