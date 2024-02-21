import React, { useEffect, useState } from "react";
import { Box, Text, Card, Layer, Button, Image } from "grommet";
import boxIcon from "../assets/box.svg";

interface BoxProps {
  name: string;
}

const BlockBox: React.FC<BoxProps> = ({ name }) => {
  const [show, setShow] = React.useState(false);

  const showModal = () => setShow(true);
  const minimizeModal = () => setShow(false);

  return (
    <Card
      onClick={showModal}
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

        cursor: "pointer",

        display: "flex",
        margin: "auto",
        marginTop: "5vw",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2>{name}</h2>
      {show && (
        <Layer onEsc={minimizeModal} onClickOutside={minimizeModal}>
          <Box pad="medium">
            <Text>You have opened {name}</Text>
            <Button
              margin={{ top: "medium" }}
              onClick={minimizeModal}
              label="Close"
            />
          </Box>
        </Layer>
      )}
      <Image src={boxIcon} width="60%" draggable="false" />
    </Card>
  );
};

export default BlockBox;
