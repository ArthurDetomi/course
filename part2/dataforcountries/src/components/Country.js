const Country = ({ fullDescription, countryData, handleClick }) => {
  if (fullDescription === false) {
    return (
      <p>
        {countryData.name.common}
        <button onClick={handleClick}>show</button>
      </p>
    );
  }

  console.log("countryData:", countryData);
  console.log("countryData.latlng:", countryData.latlng);

  return (
    <div>
      <div>
        <h2>{countryData.name.common}</h2>
        {countryData.capital.map((capitalName) => (
          <p key={capitalName}>Capital {capitalName}</p>
        ))}
        <p>Area {countryData.area}</p>
      </div>
      <div>
        <h2>Languages</h2>
        <ul>
          {Object.values(countryData.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={countryData.flags.png} />
      </div>
    </div>
  );
};

export default Country;
