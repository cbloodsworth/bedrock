import { Card, CardHeader, CardBody } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import '../styles/DroppableContainer.css'

interface Container {
  text: string;
  box: { id: string; header: string; text: string[] }[];
  id: string;
}

export default function DroppableContainer({ text, box, id }: Container) {
  return (
    <Card
      className="boxContainer"
      round={false}
      background="#f0f0f0"
      pad="medium"
      align="center"
      gap="small"
      id={id}
      style={{ width: "100%", height: "auto", overflow: "auto"}}
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
        <span style={{backgroundColor:"black", width:"100%", height:"3px"}}></span><br/>
        <Card /*background="#ADD8E6"*/ pad="small">
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
                            marginBottom: "5px",
                            textAlign: "left",
                            whiteSpace: "pre",
                            background: snapshot.isDraggingOver ? 'rgba(152, 251, 152, 0.35)' : 'transparent',
                          }}
                          className="draggableEntryBox"
                        >
                          <b style={{color:"rgb(15, 117, 150)"}}>{entry.header}</b>
                          {entry.text.length > 0 && (
                            <ul>
                              {entry.text.map((textItem, index) => (
                                <li key={index}>{textItem}</li>
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
