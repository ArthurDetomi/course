import { useState, useEffect } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: phoneNumber,
    };

    if (persons.some((person) => person.name === newName)) {
      //alert(`${newName} is already added to phonebook`);

      const person = persons.find((p) => p.name === newName);

      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one`
        )
      ) {
        const personUpdated = { ...person, number: personObject.number };

        personService
          .update(person.id, personUpdated)
          .then((returnedPerson) =>
            setPersons(
              persons.map((p) =>
                p.id !== personUpdated.id ? p : returnedPerson
              )
            )
          )
          .catch((error) => {
            alert(`the person '${newName}' was already deleted from server`);
            setPersons(persons.filter((p) => p.id !== personUpdated.id));
          });
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setPhoneNumber("");
      });
    }
  };

  const handleDelete = (id) => {
    const personToDeleted = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${personToDeleted.name}`)) {
      personService
        .deleteById(id)
        .then(() => setPersons(persons.filter((p) => p.id !== id)));
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(nameSearch)
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter nameSearch={nameSearch} setNameSearch={setNameSearch} />

      <h3>add a new</h3>

      <PersonForm
        newName={newName}
        setNewName={setNewName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        handleSubmit={handleSubmit}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
