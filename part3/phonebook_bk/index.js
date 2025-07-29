require("dotenv").config();

const Person = require("./models/person");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

function isNullOrEmpty(str) {
  return (
    str === null ||
    (typeof str === "string" && str.trim().length === 0) ||
    typeof str !== "string"
  );
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const generateId = () => {
  return getRandomArbitrary(1, Number.MAX_SAFE_INTEGER);
};

const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/info", (request, response) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`;

  let data = `<p>${new Date()}</p>`;

  response.type("text/html");
  response.json(info + data);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Number and name must be sent",
    });
  }

  if (isNullOrEmpty(body.name) || isNullOrEmpty(body.number)) {
    return response.status(400).json({
      error: "Number and name cannot be empty",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => response.json(savedPerson));
});
