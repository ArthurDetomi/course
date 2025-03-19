import { use, useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Show = ({ text, value, sign = "" }) => (
  <p>
    {text} {value} {sign}
  </p>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  function calculateTotal() {
    return good + neutral + bad;
  }

  function calculateAverage() {
    console.log(calculateTotal());
    const total = calculateTotal();

    if (total == 0) {
      return 0;
    }

    return (good - bad) / calculateTotal();
  }

  function calculatePositivePercentage() {
    const total = calculateTotal();

    if (total == 0) {
      return 0;
    }

    return (good * 100) / calculateTotal();
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <h1>statistics</h1>
      <Show text="good" value={good} />
      <Show text="neutral" value={neutral} />
      <Show text="bad" value={bad} />
      <Show text="all" value={calculateTotal()} />
      <Show text="average" value={calculateAverage()} />
      <Show text="positive" value={calculatePositivePercentage()} sign="%" />
    </div>
  );
};

export default App;
