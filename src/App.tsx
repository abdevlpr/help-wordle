import React, { useState } from "react";
import { dailyNames1, dailyNames2 } from "./TestingArray";

const allNames = [...dailyNames1, ...dailyNames2];

function App() {
  const [info, setInfo] = useState({
    contains: "",
    notContains: "",
    correctChars: "",
  });
  const [result, setResult] = useState<any>([]);

  const guessValue = () => {
    ///////// all the names in one list from wordle
    // allNames

    ///////// values from the inputs
    // info.contains
    // info.notContains
    // info.correctChars
    // info.l1
    // info.l2
    // info.l3
    // info.l4
    // info.l5

    ///////// set your found value to this result so that it will show in the h1 bellow
    //  the value should be a list of strings []
    // setResult();

    // an example
    setResult(["Good", "stuff"]);

    ///////// this is just a test it getting random value from the array
    // var randIndex = Math.floor(Math.random() * dailyNames1.length);
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
      {result.map((item: string) => (
        <h2>{item}</h2>
      ))}
    </div>
  );
}

export default App;
