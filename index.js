const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");
require("dotenv").config();
// const { json } = require("express");

//הסדר של המידלאוורים חשוב מאוד ! וגם הסדר של הבקשות.
//צריך שכל הפעולות של כתובות לא נכונות יהיו בסוף הקובץ יחד עם המידלווארים שלהם כדי לא לגרום לשגיאות מיותרות
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

app.get("/api/notes/:id", (request, response, next) => {
    Note.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(
            (error) => next(error)
            // .catch((error) => {
            //     console.log(error);
            //     // response.status(500).end();
            //     response.status(400).send({ error: 'malformatted id' })
        );
});
app.post("/api/notes", (request, response) => {
    const body = request.body;
    if (body.content === undefined) {
        return response.status(400).json({ error: "content missing" });
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    note.save().then((savedNote) => {
        response.json(savedNote);
    });
});

app.delete("/api/notes/:id", (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

//לשים לב שאנחנו שולחים אובייקט רגיל ולא אובייקט שנוצר על ידי הקלאס נאוט כמו בשאר הבקשות
app.put("/api/notes/:id", (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important,
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then((updatedNote) => {
            response.json(updatedNote);
        })
        .catch((error) => next(error));
});

//מידלואר לכתובת לא מוכרת
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

//מידלוואר לשגיאות
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }
    next(error);
};
// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
