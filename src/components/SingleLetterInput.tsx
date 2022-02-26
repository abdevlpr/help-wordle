import React from "react";

function SingleLetterInput(props: {
  id: number;
  selected: number;
  content: string;
  handleInputClick: (event: any, value: number) => void;
}) {
  return (
    <label
      className={`letter ${!props.content && "empty"} ${
        props.id === props.selected && "selected"
      }`}
      onClick={(event) => {
        props.handleInputClick(event, props.id);
      }}
    >
      {props.content}
    </label>
  );
}

export default SingleLetterInput;
