import React, { ReactNode } from "react";

interface EntryContainerProps {
  header: string;
  entryList: ReactNode[];
}

const EntryContainer: React.FC<EntryContainerProps> = ({
  header,
  entryList,
}) => {
  return (
    <div
      id="resumeContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2>{header}</h2>
      {entryList.map((entry) => entry)}
    </div>
  );
};

export default EntryContainer;
