import { useEffect, useState } from "react";

import countryService from "./services/countries";

import Country from "./components/Country";
import Filter from "./components/Filter";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    countryService.getAll().then((countriesReturned) => {
      setAllCountries(countriesReturned);
      setFilteredCountries(countriesReturned);
    });
  }, []);

  useEffect(() => {
    if (searchName === "") {
      setFilteredCountries(allCountries);
    } else {
      const filtered = allCountries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(searchName.toLocaleLowerCase())
      );

      setFilteredCountries(filtered);
    }
  }, [searchName]);

  const handleChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleClick = (countryName) => {
    setSearchName(countryName);
  };

  return (
    <div>
      <Filter handleChange={handleChange} searchName={searchName} />

      {filteredCountries.map((country) => (
        <Country
          key={country.name.common}
          fullDescription={filteredCountries.length === 1}
          countryData={country}
          handleClick={() => handleClick(country.name.common)}
        />
      ))}
    </div>
  );
}

export default App;
