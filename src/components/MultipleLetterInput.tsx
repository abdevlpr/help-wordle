import React from "react";

function MultipleLetterInput(props: {
  id: number;
  selected: number;
  content: string[];
  handleInputClick: (event: any, value: number) => void;
  contain?: boolean;
}) {
  return (
    <label
      className={`lettersWrapper ${props.contain ? "contain" : "notcontain"}  ${
        props.id === props.selected && "selected"
      }`}
      onClick={(event) => {
        props.handleInputClick(event, props.id);
      }}
    >
      {props.content.map((letter: string, index: number) => (
        <div className={`letter`} key={letter + index}>
          {letter}
        </div>
      ))}
    </label>
  );
}

export default MultipleLetterInput;
