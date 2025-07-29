import { useState, useEffect } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isSuccess: true,
  });

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
      const person = persons.find((p) => p.name === newName);

      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one`
        )
      ) {
        const personUpdated = { ...person, number: personObject.number };

        personService
          .update(person.id, personUpdated)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== returnedPerson.id ? p : returnedPerson
              )
            );
            showNotificationMessage(
              true,
              `modified number of ${personUpdated.name}`
            );
            setNewName("");
            setPhoneNumber("");
          })
          .catch((error) => {
            showNotificationMessage(
              false,
              `Information of ${personUpdated.name} has already been removed from server`
            );
            setPersons(persons.filter((p) => p.id !== personUpdated.id));
          });
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setPhoneNumber("");
      });
      showNotificationMessage(true, `added ${personObject.name}`);
    }
  };

  const handleDelete = (id) => {
    const personToDeleted = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${personToDeleted.name}`)) {
      personService.deleteById(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
        showNotificationMessage(true, `deleted ${personToDeleted.name}`);
      });
    }
  };

  const showNotificationMessage = (isSuccess, message) => {
    setNotificationMessage({
      message: message,
      isSuccess: isSuccess,
    });
    setTimeout(() => {
      setNotificationMessage({ message: null, isSuccess: null });
    }, 5000);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(nameSearch)
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notificationMessage.message}
        isSuccess={notificationMessage.isSuccess}
      />

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
