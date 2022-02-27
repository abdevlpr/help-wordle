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
import Github from "./assets/github.svg";
import Keyboard from "./components/Keyboard";
import SingleLetterInput from "./components/SingleLetterInput";
import MultipleLetterInput from "./components/MultipleLetterInput";

const allNames = [...dailyNames1, ...dailyNames2];
let foundById: any;

function App() {
  const [selected, setSelected] = useState(1);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [info, setInfo] = useState<any>({
    l1: { content: "", id: 1 },
    l2: { content: "", id: 2 },
    l3: { content: "", id: 3 },
    l4: { content: "", id: 4 },
    l5: { content: "", id: 5 },
    contains: { content: [], id: 6 },
    notContain: { content: [], id: 7 },
  });
  const [result, setResult] = useState<string[]>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // pickup the key presses from the window
  useEffect(() => {
    //check in the info which object is selected
    const found = Object.keys(info).filter(
      (infoItem) => info[infoItem].id === selected
    );
    foundById = found[0];
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

  //add one char to the input
  const addCharacterToInput = (value: string) => {
    setErrorMessage("");
    if (foundById === "notContain" || foundById === "contains") {
      setInfo({
        ...info,
        [foundById]: {
          ...info[foundById],
          content: [...info[foundById].content, value],
        },
      });
    } else {
      setInfo({ ...info, [foundById]: { ...info[foundById], content: value } });
      if (selected < 6) {
        setSelected(selected + 1);
      }
    }
  };

  //remove one char from the input
  const removeOneCharacterFromInput = () => {
    if (foundById === "notContain" || foundById === "contains") {
      const tempItem = info[foundById].content;
      tempItem.splice(tempItem.indexOf(tempItem.length - 1), 1);
      setInfo({
        ...info,
        [foundById]: {
          ...info[foundById],
          content: tempItem,
        },
      });
    } else {
      setInfo({ ...info, [foundById]: { ...info[foundById], content: "" } });
      if (selected > 1 && selected < 6) {
        setSelected(selected - 1);
      }
    }
  };

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
        if (selected < 5) {
          setSelected(selected + 1);
        }
        break;
      case "ArrowLeft":
        if (selected > 1) {
          setSelected(selected - 1);
        }
        break;
      default:
        break;
    }

    //check for the keydown to put value the input
    const regex = new RegExp("[a-zA-Z]");
    if (e.key === "Backspace") {
      removeOneCharacterFromInput();
    }

    if (regex.test(e.key) && e.key.length === 1) {
      addCharacterToInput(e.key);
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
      setErrorMessage("Minimum 3 characters as a hint");
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

    const arr: string[] = [];
    allNames.forEach((item) => {
      if (mainRe.test(item) && containsRe.test(item)) {
        arr.push(item);
      }
    });
    if (arr.length === 0) {
      setErrorMessage("no result found");
    } else {
      setErrorMessage("");
    }
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
    setResult([]);
  };

  const toggleInfoModal = () => {
    setInfoModalOpen(!infoModalOpen);
  };

  const handleInputClick = (event: any, id: number) => {
    setSelected(id);
    if (event.clientX < 300) {
      setShowKeyboard(true);
    } else if (!event.clientX) {
      setShowKeyboard(true);
    }
  };

  const handleKeyboardClick = (value: string) => {
    const regex = new RegExp("[a-zA-Z]");
    if (regex.test(value)) {
      addCharacterToInput(value);
    }
    if (value === "<") {
      removeOneCharacterFromInput();
    }
  };

  return (
    <div className="container mainApp">
      {infoModalOpen && (
        <div
          className="modal"
          onClick={() => {
            setInfoModalOpen(false);
          }}
        >
          <div
            className="InnerModalContainer column"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
              <span>Fill characters with correct spot</span>
              <img src={Tut2} alt="" />
              <label className="containTxt">Yellow box</label>
              <span>
                Fill characters known to be in the word but aren't in correct
                spot.
              </span>
              <img src={Tut3} alt="" />
              <label className="notContainTxt">Grey box</label>
              <span>Fill characters that does not exist in the word</span>
              <img src={Tut4} alt="" />
              <label>Suggested solutions box</label>
              <span>
                A generated list of words based on the search criteria to help
                you narrow down possible words.
              </span>
              <img src={Tut5} alt="" />
              <label>
                Yay!... Trying the first suggestion on the list got us the
                correct result for wordle !
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
        <a
          className="github"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/abdevlpr/help-wordle"
        >
          <img src={Github} alt="" />
        </a>
      </header>
      <main>
        <section className="trials">
          <div className="inputWrapper">
            <label>Correct spot</label>
            <div className="lettersWrapper correct">
              <SingleLetterInput
                id={info.l1.id}
                selected={selected}
                content={info.l1.content}
                handleInputClick={handleInputClick}
              />
              <SingleLetterInput
                id={info.l2.id}
                selected={selected}
                content={info.l2.content}
                handleInputClick={handleInputClick}
              />
              <SingleLetterInput
                id={info.l3.id}
                selected={selected}
                content={info.l3.content}
                handleInputClick={handleInputClick}
              />
              <SingleLetterInput
                id={info.l4.id}
                selected={selected}
                content={info.l4.content}
                handleInputClick={handleInputClick}
              />
              <SingleLetterInput
                id={info.l5.id}
                selected={selected}
                content={info.l5.content}
                handleInputClick={handleInputClick}
              />
            </div>
          </div>
          <div className="inputWrapper">
            <label>Contains</label>
            <MultipleLetterInput
              id={info.contains.id}
              selected={selected}
              content={info.contains.content}
              handleInputClick={handleInputClick}
              contain
            />
          </div>
          <div className="inputWrapper">
            <label>Does not contain</label>
            <MultipleLetterInput
              id={info.notContain.id}
              selected={selected}
              content={info.notContain.content}
              handleInputClick={handleInputClick}
            />
            <div className="resultBtn" onClick={guessValue}>
              Show Suggestions
            </div>
            <div className="clearInputs" onClick={emptyAllInputs}>
              Clear All Boxes
            </div>
          </div>
        </section>
        <section className="resultsWrapper">
          {errorMessage ? (
            <label className="error">{errorMessage}</label>
          ) : (
            <label>Suggested solutions</label>
          )}
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
        </section>
      </main>
      <Keyboard
        handleKeyboardClick={handleKeyboardClick}
        guessValue={guessValue}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
      />
      <footer>
        <span className="made">
          © 2022 by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/MossabDiae"
          >
            @MossabDiae
          </a>{" "}
          &{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/uithinker"
          >
            @uithinker
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
