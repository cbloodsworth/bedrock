import { Card, CardHeader, CardBody } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import '../styles/DroppableContainer.css'

interface Container {
  header: string;
  box: { id: string; header: string; text: string[] }[];
  id: string;
}

export default function DroppableContainer({ header, box, id }: Container) {
  return (
    <Card
      className="boxContainer"
      round={false}
      pad="medium"
      gap="small"
      id={id}
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
        }}
      >
        <span style={{backgroundColor:"black", width:"100%", height:"3px"}}></span><br/>
        <Card pad="small">
          <StrictModeDroppable droppableId={id}  type="entryBox">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CardBody
                // wrap={false}
                  style={{
                    minHeight: "7.5vh",
                    minWidth: "5vw",
                    overflowX: "auto",
                    whiteSpace: "text-wrap"
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
                            background: snapshot.isDraggingOver ? 'rgba(152, 251, 152, 0.35)' : 'transparent',
                          }}
                          className="draggableEntryBox"
                        >
                          <b style={{color:"rgb(15, 117, 150)"}}>{entry.header}</b>
                          {entry.text.length > 0 && (
                            <ul>
                              {entry.text.map((textItem, index) => (
                                <li key={id+index}>{textItem}</li>
                              ))}
                            </ul>
                          )}
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
