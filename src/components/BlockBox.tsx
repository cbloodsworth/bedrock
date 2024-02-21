import React, { ReactNode } from "react";
import { Card, CardHeader, CardBody } from "grommet";
import boxIcon from "../assets/box.svg";

interface BoxProps {
  name: string;
}

const BlockBox: React.FC<BoxProps> = ({ name }) => {
  return (
    <Card
      id="resumeContainer"
      style={{
        color: "#242424",
        background: "#F0F0F0",

        // width and height must be the same to maintain square shape
        minWidth: "10em",
        width: "10vw",
        maxWidth: "20em",

        minHeight: "10em",
        height: "10vw",
        maxHeight: "20em",

        display: "flex",
        margin: "auto",
        marginTop: "5vw",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2>{name}</h2>
      <img src={boxIcon} width="60%" draggable="false" />
    </Card>
  );
};

export default BlockBox;
