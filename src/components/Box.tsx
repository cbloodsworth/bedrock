import React, { useState } from 'react';
import '../styles/Box.css'

const Box: React.FC = () => {
  // const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // const [dragging, setDragging] = useState<boolean>(false);
  // const [initialOffset, setInitialOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   setDragging(true);
  //   setInitialOffset({
  //     x: event.clientX - position.x,
  //     y: event.clientY - position.y,
  //   });
  // };


  // const handleMouseMove = (event: MouseEvent) => {
  //   if (dragging) {
  //     setPosition({
  //       x: event.clientX - initialOffset.x,
  //       y: event.clientY - initialOffset.y,
  //     });
  //   }
  // };

  // const handleMouseUnclick = () => {
  //   setDragging(false);
  // };

  // const onMouseLeave = () => {
  //   setDragging(false);
  // }
  
  return (
    <div className = 'boxContainer' draggable="true">
      Drag me!
    </div>
  );
};

export default Box;
