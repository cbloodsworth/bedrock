import React, { ReactNode, useState } from "react";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import { TextArea } from "grommet";
import "../styles/Resume.css";

interface Props {
  children: ReactNode;
  title?: string;
  editEntry? : boolean;
  id? : string,
}


const Resume: React.FC<Props> = ({ children, title, editEntry, id }) => {
  const [editTitle, setEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleTitleDoubleClick =  () =>{
    setEditTitle(true);
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTitle(event.target.value);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      setEditTitle(false); 
    }
  }

  // const handleAddNewEntry = () => {
  //   if(addNewEntry){
  //     addNewEntry();
  //   }
  // }


  return (
    <div className="resumeContainer" id={id} style={{height: "100%"}}>
      {title && (
        <div id="headerSection">
          {editTitle ? (
            <TextArea
            className="TitleTextArea"
            value={newTitle}
            onChange={(e) => {
              handleTitleChange(e);
              const currHeight = parseInt(e.target.style.height);
              e.target.style.height = `${Math.max(e.target.scrollHeight, currHeight)}px`;
              if(currHeight < parseInt(e.target.style.height)){
                e.target.style.height = `${currHeight + 15}px`;
              }
            }}
            onBlur={() => setEditTitle(false)}
            autoFocus
            onFocus={(e) => {
              e.target.setSelectionRange(e.target.value.length, e.target.value.length);
              e.target.style.height = `${e.target.scrollHeight + 10}px`;
            }}
            onKeyDown={(event) => handleKeyPress(event)}
            resize={true}
            />
          ) : 
            (
            <h3 style={{cursor: 'pointer'}} onDoubleClick={handleTitleDoubleClick}>{newTitle}</h3>
            )
          }
        </div>
      )}

      <StrictModeDroppable
        droppableId="resumeSectionContainer"
        type="resumeSectionItem"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ width: "100%", height: "100%" }}
          >
            {React.Children.map(children, (child, index) =>
              React.isValidElement(child) ? (
                editEntry ? (
                  <div
                    key={`child-${index}`}
                    className="resumeSectionContainer"
                  >
                    {React.cloneElement(child, {editEntry : true})}
                  </div>
                ) : (
                  <Draggable
                    draggableId={`draggable-${index}`}
                    key={`draggable-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="resumeSectionContainer"
                      >
                        {child}
                      </div>
                    )}
                  </Draggable>
                )
              ) : null
            )}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
      {/* {editEntry && (<button className='newSection'onClick={handleAddNewEntry}>Add New Entry</button>)} */}
    </div>
  );
};


export default Resume;
