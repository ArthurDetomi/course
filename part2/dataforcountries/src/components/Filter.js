const Filter = ({ handleChange, searchName }) => {
  return (
    <div>
      find countries <input value={searchName} onChange={handleChange} />
    </div>
  );
};

export default Filter;
