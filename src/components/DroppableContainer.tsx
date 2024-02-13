import { Card, CardHeader, CardBody } from 'grommet';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
// import EntryBox from './EntryBox';
import { StrictModeDroppable } from './StrictModeDroppable';
import '../styles/Account.css'

interface Container {
  text: string;
  box: {id:string; header:string, text:string}[];
  id: string;
}

export default function DraggableContainer({ text, box, id }: Container) {
  return (
    <Card background="#f0f0f0" pad="medium" align="center" gap="small" id={id}>
      <CardHeader
        style={{
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        {text}
      </CardHeader>
      <CardBody style={{width: "100%"}}>
        <Card background="#ADD8E6" pad="small">
        <StrictModeDroppable droppableId={id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <CardBody
                  style={{
                    minHeight: "7.5vh",
                    minWidth: "5vw",
                  }}
                >
              {box.map((entry, index) => (
                <Draggable key={entry.id} draggableId={entry.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      draggable = 'true'
                      style={{
                        ...provided.draggableProps.style,
                        border: snapshot.isDraggingOver ? "2px solid black" : "none",
                        marginBottom: "10px"
                      }}
                    >
                      <h3>{entry.header}</h3>
                      {entry.text}
                      <br/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              </CardBody>
            </div>
          )}
        </StrictModeDroppable>
        </Card>
      </CardBody>
    </Card>
  );
}