import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((request) => request.data);
};

const getByName = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((request) => request.data);
};

export default { getAll, getByName };
