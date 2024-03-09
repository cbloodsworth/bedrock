import React, { ReactNode } from "react";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import "../styles/Resume.css";

interface Props {
  children: ReactNode;
  title?: string;
  editEntry? : boolean;
}


const Resume: React.FC<Props> = ({ children, title, editEntry }) => {
  return (
    <div id="resumeContainer" style={{height: "100%"}}>
      {title && (
        <div id="headerSection">
          <h3>{title}</h3>
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
    </div>
  );
};


export default Resume;
