const Person = ({ name, phoneNumber, handleClick }) => {
  return (
    <p>
      {name} {phoneNumber}
      <button onClick={handleClick}>Delete</button>
    </p>
  );
};

export default Person;
