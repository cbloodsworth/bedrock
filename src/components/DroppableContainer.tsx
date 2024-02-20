import { Card, CardHeader, CardBody } from "grommet";
import { Draggable } from "react-beautiful-dnd";
// import EntryBox from './EntryBox';
import { StrictModeDroppable } from "./StrictModeDroppable";

interface Container {
  text: string;
  box: { id: string; header: string; text: string }[];
  id: string;
}

export default function DraggableContainer({ text, box, id }: Container) {
  return (
    <Card
      className="boxContainer"
      round={false}
      background="#f0f0f0"
      pad="medium"
      align="center"
      gap="small"
      id={id}
      style={{ width: "100%", height: "auto", overflow: "auto" }}
    >
      <CardHeader
        style={{
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        {text}
      </CardHeader>
      <CardBody
        style={{
          width: "100%",
          height: "auto",
        }}
      >
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
                    <Draggable
                      key={entry.id}
                      draggableId={entry.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          draggable="true"
                          style={{
                            ...provided.draggableProps.style,
                            border: snapshot.isDraggingOver
                              ? "2px solid black"
                              : "2px solid transparent",
                            marginBottom: "10px",
                          }}
                        >
                          <h3>{entry.header}</h3>
                          {entry.text}
                          <br />
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
