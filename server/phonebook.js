const express = require("express");
const app = express();
var morgan = require("morgan");

app.use(express.json());

// const requestLogger = (request, response, next) => {
//     console.log("Method:", request.method);
//     console.log("Path:  ", request.path);
//     console.log("Body:  ", request.body);
//     console.log("---");
//     next();
// };
// app.use(requestLogger);

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);
function toJson(req, res) {
    return JSON.stringify(req.body);
}
// app.use(morgan("tiny"));

//מגדיר ערך שנשתמש בו אחרי זה למטה
morgan.token("jsonbody", function (req, res) {
    return JSON.stringify(req.body);
});

//נשתמש בו פה
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :jsonbody"
    )
);

let phonebook = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 4,
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 5,
    },
];

app.get("/api/persons", (req, res) => {
    res.json(phonebook);
});

app.get("/info", (req, res) => {
    res.write(`<h1>Phonebook has info for ${phonebook.length} people</h1>`);
    res.write(`<h1>${new Date()}</h1>`);
    res.send();
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = phonebook.find((obj) => obj.id === id);

    if (phonebook) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter((obj) => obj.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const maxId =
        phonebook.length > 0 ? Math.max(...phonebook.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }
    if (!body.number) {
        return response.status(400).json({
            error: "number must be unique",
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    phonebook = phonebook.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
