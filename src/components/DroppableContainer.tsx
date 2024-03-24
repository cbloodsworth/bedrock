import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, TextArea } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import "../styles/DroppableContainer.css";
import { EntryStruct } from "../utility/EntryData";

interface Container {
  id: string;
  header: string;
  box: EntryStruct[];
  resumeEntry: boolean;
  editEntry?: boolean;
}

export default function DroppableContainer({header, box , id, resumeEntry, editEntry }: Container) {
    const getInitialClick = () => {
      const initialDoubleClickStates: boolean[][] = [];
      for (let i = 0; i < box.length; i++) {
        initialDoubleClickStates.push(Array(box[i].content.length+1).fill(false));
      }
      return initialDoubleClickStates;
    }
    
    const [doubleClickStates, setDoubleClickStates] = useState<boolean[][]>(
      getInitialClick()
    );

    useEffect(() => {
      setDoubleClickStates(getInitialClick());
    }, []);


  const getInitialHeaders = () => {
    return box.map((entry) => entry.header);
  }
  const [editedHeaders, setEditedHeaders] = useState<string[]>(getInitialHeaders());
  const handleDoubleClick = (index: number) => {
    setEditedHeaders(getInitialHeaders());
    setDoubleClickStates(() => {
      const updatedStates = getInitialClick();
      updatedStates[index][0] = true;
      return updatedStates;
    });
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newContent = event.target.value;
    setEditedHeaders((prevContents) => {
      const updatedContents = [...prevContents];
      updatedContents[index] = newContent;
      return updatedContents;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>, index : number) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      setDoubleClickStates(getInitialClick()); 
      handleContentSave(index);
    }
  };

  const handleContentSave = (index: number) => {
    const updatedBox = [...box];
    updatedBox[index].header = editedHeaders[index];
    setDoubleClickStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index][0] = false;
      return updatedStates;
    });
  };



  const getInitialEditedContents = () => {
    const initialContents: string[][] = [];
    box.forEach((entry) => {
      const entryContents: string[] = entry.content.map((item) => item);
      initialContents.push(entryContents);
    });
    return initialContents;
  };
  
  const [editedContents, setEditedContents] = useState<string[][]>(
    getInitialEditedContents()
  );
  
  const handleContentItemChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number, itemIndex : number) => {
    const newContent = event.target.value;
    setEditedContents((prevContents) => {
      const updatedContents = [...prevContents];
      updatedContents[index][itemIndex] = newContent;
      return updatedContents;
    });
  };

  const handleItemKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>, index : number, itemIndex : number) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      setDoubleClickStates(getInitialClick()); 
      handleContentItemSave(index, itemIndex);
    }
  };
  
  
  const handleContentItemSave = (index : number, itemIndex : number) => {
    const updatedBox = [...box];
    updatedBox[index].content[itemIndex] = editedContents[index][itemIndex];
    setDoubleClickStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index][itemIndex+1] = false;
      return updatedStates;
    });
  }

  const handleItemDoubleClick = (index : number, itemIndex : number) => {
    setEditedContents(getInitialEditedContents());
    setDoubleClickStates((prevStates) => {
      try {
        const updatedStates = [...prevStates];
        updatedStates[index][itemIndex + 1] = true;
        return updatedStates;
      } catch (error) {
        console.error('Error occurred while updating double click states:', doubleClickStates);
        return prevStates; 
      }
    });
  }

  const [newHeader, setNewHeader] = React.useState(header);

  useEffect(() => {
    setNewHeader(header);
  }, [header]);

  const [headerClickState, setHeaderClickState] = React.useState(false);

  const handleHeaderDoubleClick = () => {
    setHeaderClickState(!headerClickState);
  }
  const handleHeaderChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newHeader = event.target.value;
    setNewHeader(()=> {
      return newHeader;
    });
  };

  const handleHeaderKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      setHeaderClickState(false);
    }
  };

  const removeListItem = (entry: EntryStruct, itemIndex: number) => {
    entry.content.splice(itemIndex, 1);
    setEditedContents((prevStates) => {
      const updatedStates = [...prevStates];
      return updatedStates;
    });
  };

  const addNewListItem = (entry : EntryStruct) => {
    entry.content.push("Text Here");
    setEditedContents((prevContents) => {
      const updatedContents = [...prevContents];
      return updatedContents;
    });
  }

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
        {editEntry && newHeader !== "Uncategorized" && headerClickState ? (
          <TextArea
            className="entryTextAreaBox"
            value={newHeader}
            onChange={(e) => handleHeaderChange(e, 0)}
            onBlur={() => setDoubleClickStates(getInitialClick())}
            autoFocus
            onKeyDown={(event) => handleHeaderKeyPress(event, 0)}
            resize={true}
          />
        ) : (
          <div onDoubleClick={() => handleHeaderDoubleClick()}>{newHeader}</div>
        )}
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
                          {resumeEntry ? (
                            <b>
                            {doubleClickStates && doubleClickStates[index] && doubleClickStates[index][0] ? (
                              <>
                              <TextArea
                                className="entryTextAreaBox"
                                value={editedHeaders[index]}
                                onChange={(e) => {
                                  handleContentChange(e, index);
                                  const currHeight = parseInt(e.target.style.height);
                                  e.target.style.height = `${Math.max(e.target.scrollHeight, currHeight)}px`;
                                  if(currHeight < parseInt(e.target.style.height)){
                                    e.target.style.height = `${currHeight + 15}px`;
                                  }
                                }}
                                onBlur={() => handleContentSave(index)}
                                autoFocus
                                onFocus={(e) => {
                                  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                  e.target.style.height = `${e.target.scrollHeight+10}px`;
                                }}
                                onKeyDown={(event) => handleKeyPress(event,index)}
                                resize={true}
                              />
                              </>
                            ) : (
                              <div className='clickableEntry' onDoubleClick={() => handleDoubleClick(index)}>
                                {entry.header}
                              </div>
                            )}
                            </b>
                            ) : (
                              <ul>
                              <li>
                              <b style={{ color: "rgb(15, 117, 150)" }}>
                                {doubleClickStates && doubleClickStates[index] && doubleClickStates[index][0] ? (
                                  <>
                                  <TextArea
                                    className="entryTextAreaBox"
                                    value={editedHeaders[index]}
                                    onChange={(e) => {
                                      handleContentChange(e, index);
                                      const currHeight = parseInt(e.target.style.height);
                                      e.target.style.height = `${Math.max(e.target.scrollHeight, currHeight)}px`;
                                      if(currHeight < parseInt(e.target.style.height)){
                                        e.target.style.height = `${currHeight + 15}px`;
                                      }
                                    }}
                                    onBlur={() => handleContentSave(index)}
                                    autoFocus
                                    onFocus={(e) => {
                                      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                      e.target.style.height = `${e.target.scrollHeight + 10}px`;
                                    }}
                                    onKeyDown={(event) => handleKeyPress(event,index)}
                                    resize={true}
                                  />
                                  </>
                                ) : (
                                  <div onClick={() => handleDoubleClick(index)}>
                                    {entry.header}
                                  </div>
                                )
                                }
                              </b>
                              </li>
                            </ul>
                            )}
                          {entry.content.length > 0 && (
                            <ul style={{position: "relative"}}>
                            {entry.content.map((textItem, itemIndex) => (
                              <li key={id + itemIndex}>
                                {editEntry && (<button onClick={() => removeListItem(entry, itemIndex)} className="removeListItemButton">-</button>)}
                                {doubleClickStates && doubleClickStates[index] && doubleClickStates[index][itemIndex + 1] ? (
                                  <TextArea
                                    className="entryTextAreaBox"
                                    value={editedContents[index][itemIndex]}
                                    onChange={(e) => {
                                      handleContentItemChange(e, index, itemIndex);
                                      const currHeight = parseInt(e.target.style.height);
                                      e.target.style.height = `${Math.max(e.target.scrollHeight, currHeight)}px`;
                                      if(currHeight < parseInt(e.target.style.height)){
                                        e.target.style.height = `${currHeight + 15}px`;
                                      }
                                    }}
                                    onBlur={() => handleContentItemSave(index, itemIndex)}
                                    autoFocus
                                    onFocus={(e) => {
                                      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                      e.target.style.height = `${e.target.scrollHeight + 10}px`;
                                    }}
                                    onKeyDown={(event) => handleItemKeyPress(event, index, itemIndex)}
                                    resize={true}
                                  />
                                ) : (
                                  <div
                                    onDoubleClick={() => handleItemDoubleClick(index, itemIndex)}
                                  >
                                    {textItem}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                          )}
                          {editEntry && (<button onClick={() => addNewListItem(entry)} className = "addEntryButton">+</button>)}
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
