const PersonForm = ({
  newName,
  setNewName,
  phoneNumber,
  setPhoneNumber,
  handleSubmit,
}) => {
  const handleChangeName = (event) => {
    setNewName(event.target.value);
  };

  const handleChangePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChangeName} />
      </div>
      <div>
        number: <input value={phoneNumber} onChange={handleChangePhoneNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
