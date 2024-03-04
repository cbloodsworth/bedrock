import { Card, CardHeader, CardBody } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import "../styles/DroppableContainer.css";
import { EntryStruct } from "../utility/EntryData";

interface Container {
  id: string;
  header: string;
  box: EntryStruct[];
}

export default function DroppableContainer({ header, box, id }: Container) {
  return (
    <Card
      className="boxContainer"
      round={false}
      pad="small"
      gap="small"
      id={id}
      elevation="none"
    >
      <CardHeader
        style={{
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        {header}
      </CardHeader>
      <CardBody
        style={{
          width: "100%",
          height: "auto",
          alignContent: "center",
        }}
      >
        <span
          style={{
            margin: "0 auto",
            backgroundColor: "black",
            width: "100%",
            height: "3px",
          }}
        ></span>
        <br />
        <Card pad="small" round={false} elevation="none">
          <StrictModeDroppable droppableId={id} type="entryBox">
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
                            background: snapshot.isDraggingOver
                              ? "rgba(152, 251, 152, 0.35)"
                              : "transparent",
                          }}
                          className="draggableEntryBox"
                        >
                          {entry.content.length > 0 ? (
                            <>
                              <b style={{ color: "rgb(15, 117, 150)" }}>
                                {entry.header}
                              </b>
                              <ul>
                                {entry.content.map((textItem, index) => (
                                  <li key={id + index}>{textItem}</li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <ul>
                              <li>
                                <b style={{ color: "rgb(15, 117, 150)" }}>
                                  {entry.header}
                                </b>
                              </li>
                            </ul>
                          )}
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
