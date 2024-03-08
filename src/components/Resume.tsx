import React, { ReactNode } from "react";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import "../styles/Resume.css";

interface Props {
  children: ReactNode;
}

const Resume: React.FC<Props> = ({ children }) => {
  return (
    <div id="resumeContainer">
      <div id="headerSection">
        <h3>Esteban's Resume</h3>
      </div>

      <StrictModeDroppable
        droppableId="resumeSectionContainer"
        type="resumeSectionItem"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ width: "100%" }}
          >
            {" "}
            {React.Children.map(children, (child, index) =>
              React.isValidElement(child) ? (
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
                      {React.cloneElement(child, {
                        key: `child-${index}`,
                      })}
                    </div>
                  )}
                </Draggable>
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
