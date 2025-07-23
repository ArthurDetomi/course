import Person from "./Person";

const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          phoneNumber={person.number}
          name={person.name}
        />
      ))}
    </div>
  );
};

export default Persons;
