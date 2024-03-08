import React, { useEffect, useState } from "react";
import { Box, Text, Card, Layer, Button, Image } from "grommet";
import boxIcon from "../assets/box.svg";

interface ModalProps {
  name: string;
  setShow: (show: boolean) => void;
}

const BlockBoxModal: React.FC<ModalProps> = ({ name, setShow }) => {
  return (
    <Card
      pad="medium"
      style={{
        height: "100%",
        width: "100%",

        display: "flex",
        margin: "auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2>{name}</h2>
      <Text> This is some content relating to the {name} box.</Text>
      <Button
        margin={{ top: "medium" }}
        onClick={() => setShow(false)}
        label="Close"
      />
    </Card>
  );
};

export default BlockBoxModal;
