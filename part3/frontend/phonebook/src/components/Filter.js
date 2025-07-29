const Filter = ({ nameSearch, setNameSearch }) => {
  const handleNameSearchChange = (event) => {
    setNameSearch(event.target.value);
  };

  return (
    <div>
      filter shown with{" "}
      <input value={nameSearch} onChange={handleNameSearchChange} />
    </div>
  );
};

export default Filter;
