import { SectionMap } from "../utility/EntryData";
import DroppableContainer from "./DroppableContainer";

interface SideContainer {
  sections: SectionMap;
}

export default function SideEntriesContainer({ sections }: SideContainer) {
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
      {Object.entries(sections)
        .filter(([sectionID, _]) => {
          return sectionID.includes("SEB");
        })
        .map(([sectionID, section]) => {
          return (
            <DroppableContainer
              header={section.sectionHeader}
              box={section.entryList.map((entry) => {
                return { ...entry, content: [] };
              })}
              id={sectionID}
            />
          );
        })}
    </div>
  );
}
