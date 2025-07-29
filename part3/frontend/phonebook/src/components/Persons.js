import Person from "./Person";

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          phoneNumber={person.number}
          name={person.name}
          handleClick={() => handleDelete(person.id)}
        />
      ))}
    </div>
  );
};

export default Persons;
