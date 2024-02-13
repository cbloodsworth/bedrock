import React, { useState } from 'react';
import '../styles/Box.css'

interface Entry {
  header: string;
  text: string;
  id: string;
}
const EntryBox: React.FC<Entry> = ({ header, text, id }) => {
  return (
    <div className="boxContainer" draggable="true" id={id}>
      {/* You can use header and text here */}
      <div>{header}</div>
      <div>{text}</div>
      {/* Or if you want, you can use them like below */}
      {/* <div>{props.header}</div>
      <div>{props.text}</div> */}
      Drag me!
    </div>
  );
};

export default EntryBox;
