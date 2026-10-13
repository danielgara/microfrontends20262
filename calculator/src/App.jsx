import { useState } from "react";

function readNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function App() {
  const [first, setFirst] = useState("0");
  const [second, setSecond] = useState("0");
  const [result, setResult] = useState(null);

  return (
    <section className="calculator">
      <h2>Calculator</h2>
      <p className="tag">React</p>
      <div className="fields">
        <label>
          First number
          <input
            type="number"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
          />
        </label>
        <label>
          Second number
          <input
            type="number"
            value={second}
            onChange={(event) => setSecond(event.target.value)}
          />
        </label>
      </div>
      <div className="actions">
        <button type="button" onClick={() => setResult(readNumber(first) + readNumber(second))}>
          Add
        </button>
        <button type="button" onClick={() => setResult(readNumber(first) - readNumber(second))}>
          Subtract
        </button>
      </div>
      <p className="result">Result: {result === null ? "—" : result}</p>
    </section>
  );
}
