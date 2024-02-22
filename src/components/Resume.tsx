import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Resume: React.FC<Props> = ({ children }) => {
  return (
    <div
      id="resumeContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        border: "2px solid #111111",
        backgroundColor: "#f0f0f0",
        height: "auto"
      }}
    >
      <h3>Esteban's Resume</h3>
      {children}
    </div>
  );
};

export default Resume;
