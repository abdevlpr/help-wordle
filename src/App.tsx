import React, { useState } from "react";
import { dailyNames1, dailyNames2 } from "./TestingArray";

const allNames = [...dailyNames1, ...dailyNames2];

function App() {
  const [info, setInfo] = useState<any>({
    contains: "",
    notContains: "",
    l1: "",
    l2: "",
    l3: "",
    l4: "",
    l5: "",
  });
  const [result, setResult] = useState<any>([]);

  const guessValue = () => {
    ///////// all the names in one list from wordle
    const p1 = info.l1 ?? info.notContains ?? ""
    const reString = `^`
    // get include and exclude

    // generate positions reg : if position have letter put it 
    // if no letter, exclude the notContains 

    // pass the regexes into the their position in the big reg


    // refine the final result with regex with the contains letters

    const myRe = new RegExp(`['${info.l1}'].*['${info.l3}'].*['${info.l5}']`);
    const arr = [""];
    allNames.forEach((item) => {
      // add the refine condition here (if .. and ..)
      if (myRe.test(item) ) {
        arr.push(item);
      }
    });

    console.log("arr: ", arr);

    ///////// values from the inputs
    // info.contains
    console.log("info.contains: ", info.contains);
    // info.notContains
    console.log("info.notContains: ", info.notContains);
    // info.l1
    console.log("info.l1: ", info.l1);
    // info.l2
    console.log("info.l2: ", info.l2);
    // info.l3
    console.log("info.l3: ", info.l3);
    // info.l4
    console.log("info.l4: ", info.l4);
    // info.l5
    console.log("info.l5: ", info.l5);

    ///////// set your found value to this result so that it will show in the h1 bellow
    //  the value should be a list of strings []
    // setResult();

    // an example
    setResult(["Good", "stuff"]);

    ///////// this is just a test it getting random value from the array
    // var randIndex = Math.floor(Math.random() * dailyNames1.length);
  };

  const handleInputChange = (e: any) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");

    // Check if they hit the max character length
    if (value.length === maxLength) {
      // Check if it's not the last input field
      if (parseInt(fieldIndex, 10) < 5) {
        // Get the next input field
        const nextSibling: any = document.querySelector(
          `input[name=ssn-${parseInt(fieldIndex, 10) + 1}]`
        );

        // If found, focus the next field
        if (nextSibling !== null) {
          nextSibling.focus();
        }
      }
    }
  };

  const emptyInput = (e: any) => {
    // if (e.target.value) {
    //   setInfo({ ...info, [e.target.id]: "" });
    // }
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
          value={info.contains}
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
          value={info.notContains}
          onChange={(e) => {
            setInfo({ ...info, notContains: e.target.value });
          }}
        />
      </div>
      <div className="input_wrappers">
        <label htmlFor="correctChars">correctChars</label>
        <div className="input_horiz">
          <input
            type="text"
            onChange={handleInputChange}
            onFocus={emptyInput}
            value={info.l1}
            maxLength={1}
            name="ssn-1"
            id="l1"
          />
          <input
            type="text"
            onChange={handleInputChange}
            onFocus={emptyInput}
            maxLength={1}
            name="ssn-2"
            value={info.l2}
            id="l2"
          />
          <input
            type="text"
            onChange={handleInputChange}
            onFocus={emptyInput}
            maxLength={1}
            name="ssn-3"
            value={info.l3}
            id="l3"
          />
          <input
            type="text"
            onChange={handleInputChange}
            onFocus={emptyInput}
            maxLength={1}
            name="ssn-4"
            value={info.l4}
            id="l4"
          />
          <input
            type="text"
            onChange={handleInputChange}
            onFocus={emptyInput}
            maxLength={1}
            name="ssn-5"
            value={info.l5}
            id="l5"
          />
        </div>
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
