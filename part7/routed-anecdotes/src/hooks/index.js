import { useState } from "react";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = ({ target }) => {
    setValue(target.value);
  };

  const reset = () => {
    setValue("");
  };

  const inputProps = {
    type,
    onChange,
    value,
  };

  return [inputProps, reset];
};
