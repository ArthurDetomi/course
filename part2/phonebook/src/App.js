import { useState, useEffect } from "react";
import axios from "axios";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: phoneNumber,
    };

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName("");
      setPhoneNumber("");
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
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
