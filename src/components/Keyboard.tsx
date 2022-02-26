import React from "react";

const keyboardRowOne = "qwertyuiop";
const keyboardRowTwo = "asdfghjkl";
const keyboardRowThree = "zxcvbnm";

function Keyboard(props: {
  handleKeyboardClick: (value: string) => void;
  guessValue: () => void;
  showKeyboard: boolean;
  setShowKeyboard: (value: boolean) => void;
}) {
  return (
    <div className={`keyboard`}>
      <div
        className="toggleKeyboard"
        onClick={() => {
          props.setShowKeyboard(!props.showKeyboard);
        }}
      >
        {props.showKeyboard ? "Hide Keyboad" : "Show keyboard"}
      </div>
      <KeyboardRow
        handleKeyboardClick={props.handleKeyboardClick}
        showKeyboard={props.showKeyboard}
        list={keyboardRowOne}
      />
      <KeyboardRow
        handleKeyboardClick={props.handleKeyboardClick}
        showKeyboard={props.showKeyboard}
        list={keyboardRowTwo}
        showHalf
      />
      <KeyboardRow
        handleKeyboardClick={props.handleKeyboardClick}
        showKeyboard={props.showKeyboard}
        list={keyboardRowThree}
        lastRow
        guessValue={props.guessValue}
      />
    </div>
  );
}

const KeyboardRow = (props: {
  handleKeyboardClick: (value: string) => void;
  guessValue?: () => void;
  showKeyboard: boolean;
  list: string;
  showHalf?: boolean;
  lastRow?: boolean;
}) => {
  return (
    <div className={`keyboardRow ${props.showKeyboard && "showKeyboard"}`}>
      {props.showHalf && <div className="half"></div>}
      {props.lastRow && (
        <div className="key oneandhalf" onClick={props.guessValue}>
          enter
        </div>
      )}
      {props.list.split("").map((keyItem) => (
        <div
          className="key"
          key={keyItem}
          onClick={() => {
            props.handleKeyboardClick(keyItem);
          }}
        >
          {keyItem}
        </div>
      ))}
      {props.lastRow && (
        <div
          className="key oneandhalf"
          onClick={() => {
            props.handleKeyboardClick("<");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              fill="white"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
            ></path>
          </svg>
        </div>
      )}
      {props.showHalf && <div className="half"></div>}
    </div>
  );
};

export default Keyboard;
