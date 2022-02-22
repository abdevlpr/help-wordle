import React, { useEffect, useState } from "react";
import { dailyNames1, dailyNames2 } from "./mock/wordleArrays";
import closeIcon from "./assets/close.svg";
import infoIcon from "./assets/info.svg";
import logoIcon from "./assets/logo.svg";
import arrowIcon from "./assets/arrow.svg";
import Tut1 from "./assets/tutorial/1.png";
import Tut2 from "./assets/tutorial/2.png";
import Tut3 from "./assets/tutorial/3.png";
import Tut4 from "./assets/tutorial/4.png";
import Tut5 from "./assets/tutorial/5.png";
import Tut6 from "./assets/tutorial/6.png";

const allNames = [...dailyNames1, ...dailyNames2];

const keyboardRowOne = "qwertyuiop";
const keyboardRowTwo = "asdfghjkl";
const keyboardRowThree = "zxcvbnm";

function App() {
  const [selected, setSelected] = useState(1);
  const [info, setInfo] = useState<any>({
    l1: { content: "", id: 1 },
    l2: { content: "", id: 2 },
    l3: { content: "", id: 3 },
    l4: { content: "", id: 4 },
    l5: { content: "", id: 5 },
    contains: { content: [], id: 6 },
    notContain: { content: [], id: 7 },
  });
  const [result, setResult] = useState<any>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // pickup the key presses from the window
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    info.l1.content,
    info.l2.content,
    info.l3.content,
    info.l4.content,
    info.l5.content,
    info.contains.content,
    info.notContain.content,
  ]);

  //handle keypressed on the window
  const handleKeyDown = (e: any) => {
    if (e.key === "Backspace") {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      guessValue();
    }
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      if (selected <= 1) {
        setSelected(7);
      } else {
        setSelected(selected - 1);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (selected >= 7) {
        setSelected(1);
      } else {
        setSelected(selected + 1);
      }
    }
    switch (e.key) {
      case "ArrowUp":
        if (selected === 7) {
          setSelected(6);
        } else if (selected === 6) {
          setSelected(1);
        }
        break;
      case "ArrowDown":
        if (selected <= 5) {
          setSelected(6);
        } else if (selected === 6) {
          setSelected(7);
        }
        break;
      case "ArrowRight":
        if (selected === 1) {
          setSelected(2);
        } else if (selected === 2) {
          setSelected(3);
        } else if (selected === 3) {
          setSelected(4);
        } else if (selected === 4) {
          setSelected(5);
        }
        break;
      case "ArrowLeft":
        if (selected === 5) {
          setSelected(4);
        } else if (selected === 4) {
          setSelected(3);
        } else if (selected === 3) {
          setSelected(2);
        } else if (selected === 2) {
          setSelected(1);
        }
        break;
      default:
        break;
    }

    //check for the keydown to put value the input
    const regex = new RegExp("[a-zA-Z]");
    if (e.key === "Backspace") {
      const found = Object.keys(info).filter(
        (infoItem) => info[infoItem].id === selected
      );
      if (found[0] === "notContain" || found[0] === "contains") {
        const tempItem = info[found[0]].content;
        tempItem.splice(tempItem.indexOf(tempItem.length - 1), 1);
        setInfo({
          ...info,
          [found[0]]: {
            ...info[found[0]],
            content: tempItem,
          },
        });
      } else {
        setInfo({ ...info, [found[0]]: { ...info[found[0]], content: "" } });
      }
    }

    if (regex.test(e.key) && e.key.length === 1) {
      const found = Object.keys(info).filter(
        (infoItem) => info[infoItem].id === selected
      );
      if (found[0] === "notContain" || found[0] === "contains") {
        setInfo({
          ...info,
          [found[0]]: {
            ...info[found[0]],
            content: [...info[found[0]].content, e.key],
          },
        });
      } else {
        setInfo({ ...info, [found[0]]: { ...info[found[0]], content: e.key } });
      }
    }
  };

  const guessValue = () => {
    const containsArrayLength = parseInt(info.contains.content.length);
    const NotContainsArrayLength = parseInt(info.notContain.content.length);
    const L1Length = parseInt(info.l1.content.length);
    const L2Length = parseInt(info.l2.content.length);
    const L3Length = parseInt(info.l3.content.length);
    const L4Length = parseInt(info.l4.content.length);
    const L5Length = parseInt(info.l5.content.length);
    if (
      containsArrayLength +
        NotContainsArrayLength +
        L1Length +
        L2Length +
        L3Length +
        L4Length +
        L5Length <=
      2
    ) {
      setResult([]);
      return;
    }

    // Generate regexes strings
    interface regObjInterface {
      [key: string]: string;
    }
    const regStrings: regObjInterface = {
      l1: "",
      l2: "",
      l3: "",
      l4: "",
      l5: "",
    };

    // for a given position: if letter is set use it , else at least
    // check against notContains .
    for (const key in regStrings) {
      if (info[key].content) {
        regStrings[key] = `[${info[key].content}]`;
      } else {
        regStrings[key] = `[^${info.notContain.content.join("")}]`;
      }
    }

    // Concatenating regStrings into one fullRegString and generating main regex obj
    const fullRegString = "".concat(...Object.values(regStrings));
    const mainRe = new RegExp(`${fullRegString}`);

    // refine result with containsRe generated from info.contains chars
    // if not chars always return true
    let containsReString = "";

    if (info.contains.content.length) {
      const containsArr = info.contains.content;
      containsArr.forEach((char: string) => {
        containsReString += `(?=.*${char})`;
      });
    } else {
      containsReString = "^.*$";
    }

    const containsRe = new RegExp(`${containsReString}`);

    const arr = [""];
    allNames.forEach((item) => {
      if (mainRe.test(item) && containsRe.test(item)) {
        arr.push(item);
      }
    });
    setResult(arr);
  };

  const emptyAllInputs = () => {
    setInfo({
      l1: { content: "", id: 1 },
      l2: { content: "", id: 2 },
      l3: { content: "", id: 3 },
      l4: { content: "", id: 4 },
      l5: { content: "", id: 5 },
      contains: { content: [], id: 6 },
      notContain: { content: [], id: 7 },
    });
  };

  const toggleInfoModal = () => {
    setInfoModalOpen(!infoModalOpen);
  };

  return (
    <div className="container">
      {infoModalOpen && (
        <div className="modal">
          <div className="container column inner">
            <div className="modalHeader">
              <label>How to use the helper</label>
              <img src={closeIcon} onClick={toggleInfoModal} alt="" />
            </div>
            <div className="modalContainer">
              <span>This first try from Wordle as an Example</span>
              <img src={Tut1} alt="" />
              <span>From this word fill in the boxes to help you</span>
              <img src={arrowIcon} className="arrowImg" alt="" />
              <label className="correctTxt">Green boxes</label>
              <span>For characters with correct position</span>
              <img src={Tut2} alt="" />
              <label className="containTxt">Yellow box</label>
              <span>
                For characters known in the word but not in the correct place
              </span>
              <img src={Tut3} alt="" />
              <label className="notContainTxt">Grey box</label>
              <span>For characters that does not exist in the word</span>
              <img src={Tut4} alt="" />
              <label>Suggested solutions box</label>
              <span>
                List for suggested words based on the filled boxes to help you
                narrow down the list
              </span>
              <img src={Tut5} alt="" />
              <label>
                Yay!... Testing with the first word on the list got us the
                result correct in wordle
              </label>
              <img src={Tut6} alt="" />
            </div>
          </div>
        </div>
      )}
      <header>
        <div className="btn" onClick={toggleInfoModal}>
          <img src={infoIcon} alt="" />
        </div>
        <div className="logo">
          <img src={logoIcon} alt="" />
        </div>
      </header>
      <main>
        <section className="trials">
          <div className="inputWrapper">
            <label>Correct Place</label>
            <div className="lettersWrapper correct">
              <input
                type="text"
                id="justInput"
                value={0}
                style={{
                  height: "0",
                  width: "0",
                  padding: "0",
                  margin: "0",
                  border: "none",
                }}
              />
              <label
                htmlFor="justInput"
                className={`letter ${!info.l1.content && "empty"} ${
                  info.l1.id === selected && "selected"
                }`}
                onClick={() => {
                  setSelected(info.l1.id);
                }}
              >
                {info.l1.content}
              </label>
              <label
                htmlFor="justInput"
                className={`letter ${info.l2.content ? "" : "empty"} ${
                  info.l2.id === selected ? "selected" : ""
                }`}
                onClick={() => {
                  setSelected(info.l2.id);
                }}
              >
                {info.l2.content}
              </label>
              <label
                htmlFor="justInput"
                className={`letter ${!info.l3.content && "empty"} ${
                  info.l3.id === selected && "selected"
                }`}
                onClick={() => {
                  setSelected(info.l3.id);
                }}
              >
                {info.l3.content}
              </label>
              <label
                htmlFor="justInput"
                className={`letter ${!info.l4.content && "empty"} ${
                  info.l4.id === selected && "selected"
                }`}
                onClick={() => {
                  setSelected(info.l4.id);
                }}
              >
                {info.l4.content}
              </label>
              <label
                htmlFor="justInput"
                className={`letter ${!info.l5.content && "empty"} ${
                  info.l5.id === selected && "selected"
                }`}
                onClick={() => {
                  setSelected(info.l5.id);
                }}
              >
                {info.l5.content}
              </label>
            </div>
          </div>
          <div className="inputWrapper">
            <label>Contains</label>
            <label
              htmlFor="justInput"
              className={`lettersWrapper contain ${
                info.contains.id === selected && "selected"
              }`}
              onClick={() => {
                setSelected(info.contains.id);
              }}
            >
              {info.contains.content.map((letter: string, index: number) => (
                <div className={`letter`} key={letter + index}>
                  {letter}
                </div>
              ))}
            </label>
          </div>
          <div className="inputWrapper">
            <label>Does not Contain</label>
            <label
              htmlFor="justInput"
              className={`lettersWrapper notcontain ${
                info.notContain.id === selected && "selected"
              }`}
              onClick={() => {
                setSelected(info.notContain.id);
              }}
            >
              {info.notContain.content.map((letter: string, index: number) => (
                <div className={`letter`} key={letter + index}>
                  {letter}
                </div>
              ))}
            </label>
            <div className="keyboard">
              <div className="keyboardRow">
                {keyboardRowOne.split("").map((keyItem) => (
                  <div className="key" key={keyItem}>
                    {keyItem}
                  </div>
                ))}
              </div>
              <div className="keyboardRow">
                {keyboardRowTwo.split("").map((keyItem) => (
                  <div className="key" key={keyItem}>
                    {keyItem}
                  </div>
                ))}
              </div>
              <div className="keyboardRow">
                <div className="key">enter</div>
                {keyboardRowThree.split("").map((keyItem) => (
                  <div className="key" key={keyItem}>
                    {keyItem}
                  </div>
                ))}
                <div className="key">{`<`}</div>
              </div>
            </div>
            <div className="resultBtn" onClick={guessValue}>
              Show Suggestions
            </div>
            <div className="clearInputs" onClick={emptyAllInputs}>
              Clear All Boxes
            </div>
          </div>
        </section>
        <section className="resultsWrapper">
          <label>Suggested solutions</label>
          <section className="results">
            {result.map(
              (word: string, index: number) =>
                word && (
                  <div className="word" key={word + index}>
                    {word.split("").map((letter, index) => (
                      <div className={`letter`} key={letter + index}>
                        {letter}
                      </div>
                    ))}
                  </div>
                )
            )}
          </section>
          <span className="made">
            made by <a href="https://twitter.com/MossabDiae">@diamossab</a> &{" "}
            <a href="https://twitter.com/uithinker">@uithinker</a>
          </span>
        </section>
      </main>
    </div>
  );
}

export default App;
