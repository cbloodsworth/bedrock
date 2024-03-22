import { Section } from "../utility/EntryData";
import DroppableContainer from "./DroppableContainer";

interface SECProps {
  sections: Section[];
}
export default function SideEntriesContainer({ sections }: SECProps) {
  return (
    <div
      id="EntriesWrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        border: "2px solid #111111",
        backgroundColor: "#f0f0f0",
        height: "auto",
        position: "sticky",
        top: "10px",
        zIndex: 0,
      }}
    >
      {sections.map((section) => (
        <DroppableContainer
          header={section.sectionHeader}
          box={section.entryList.map((entry) => {
            return { ...entry, content: [] }; // limit the info that shows up on sidesection box
          })}
          id={section.sectionID}
          resumeEntry={false}
        />
      ))}
    </div>
  );
}
