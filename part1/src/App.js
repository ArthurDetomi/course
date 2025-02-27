const Hello = (props) => {
  console.log(props);

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old!
      </p>
    </div>
  );
};

const App = () => {
  const friends = ["Arthur", "Matheus"];

  return (
    <div>
      <p>{friends}</p>
    </div>
  );
};

export default App;
