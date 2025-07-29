require("dotenv").config();

const Person = require("./models/person");

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

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const info = `<p>Phonebook has info for ${count} people</p>`;
      const data = `<p>${new Date()}</p>`;

      response.type("text/html");
      response.send(info + data);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);

  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);

  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
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

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  const person = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(request.params.id, person)
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Middleware Endpoint não existe

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// End Middleware Endpoint não existe

// Middleware de Erro

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
};

app.use(errorHandler);

// End Midleware de Erro
