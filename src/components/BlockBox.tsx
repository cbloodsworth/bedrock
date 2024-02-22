import React from "react";
import { Image } from "grommet";
import boxIcon from "../assets/box.svg";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface BoxProps {
  name: string;
  id: string;
}

const BlockBox: React.FC<BoxProps> = ({ name, id }) => {
  return (
    <StrictModeDroppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            minHeight: "7.5vh",
            minWidth: "5vw",
            background: "#F0F0F0",
            width: "10vw",
            maxWidth: "20em",
            height: "10vw",
            maxHeight: "20em",
            margin: "auto",
            marginTop: "5vw",
            padding: "20px",
            backgroundColor: "#ADD8E6",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>{name}</h2>
            <Image src={boxIcon} width="60%" draggable="false" />
          </div>
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default BlockBox;
