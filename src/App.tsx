import React, { useState } from "react";
import { dailyNames1, dailyNames2 } from "./TestingArray";

function App() {
  const [info, setInfo] = useState({
    contains: "",
    notContains: "",
    correctChars: "",
  });
  const [result, setResult] = useState("");

  const guessValue = () => {
    // the first words list (array) from wordle
    // dailyNames1

    // the second words list (array) from wordle
    // dailyNames2

    // set your found value to this result so that it will show in the h1 bellow
    // setResult(found value here);

    // this is just a test it getting random value from the array
    var randIndex = Math.floor(Math.random() * dailyNames1.length);
    setResult(dailyNames1[randIndex]);
  };

  return (
    <div className="container">
      <div>
        <label>daily names 1</label>
        <div className="names_wrapper">
          {dailyNames1.map((name) => (
            <span>{name}</span>
          ))}
        </div>
      </div>
      <div>
        <label>daily names 2</label>
        <div className="names_wrapper">
          {dailyNames2.map((name) => (
            <span>{name}</span>
          ))}
        </div>
      </div>
      <div className="input_wrappers">
        <label htmlFor="contains">contains</label>
        <input
          type="text"
          id="contains"
          onChange={(e) => {
            setInfo({ ...info, contains: e.target.value });
          }}
        />
      </div>
      <div className="input_wrappers">
        <label htmlFor="notContains">does not contains</label>
        <input
          type="text"
          id="notContains"
          onChange={(e) => {
            setInfo({ ...info, notContains: e.target.value });
          }}
        />
      </div>
      <div className="input_wrappers">
        <label htmlFor="correctChars">tested</label>
        <input
          type="text"
          id="correctChars"
          onChange={(e) => {
            setInfo({ ...info, correctChars: e.target.value });
          }}
        />
      </div>
      <div className="input_wrappers">
        <input type="button" value="submit" onClick={guessValue} />
      </div>
      <h1>{result}</h1>
    </div>
  );
}

export default App;
