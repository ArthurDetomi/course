import { useState } from "react";

import { useMutation } from "@apollo/client";

import { EDIT_BORN } from "../queries";

const BornForm = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const [changeNumber] = useMutation(EDIT_BORN);

  const handleSubmit = (event) => {
    event.preventDefault();

    changeNumber({ variables: { name, born: Number(year) } });

    setName("");
    setYear("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BornForm;
