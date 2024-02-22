import { Card, CardHeader, CardBody } from "grommet";
import { Draggable } from "react-beautiful-dnd";
// import EntryBox from './EntryBox';
import { StrictModeDroppable } from "./StrictModeDroppable";
// import { redirect } from "react-router-dom";

interface Container {
  box: { id: string; header: string; text: string }[];
  id: string;
}

export default function EntriesContainer({box, id }: Container) {
    return (
        <div style={{
            right: '0',
            width: "90%"
        }}>
      <Card
        className="entriesContainer"
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
          <h2>Entries</h2>
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
      </div>
    );
  }