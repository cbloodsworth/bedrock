import DroppableContainer from "./DroppableContainer";
import { SectionsArray, EntryStruct } from "../utility/EntryData";

interface EntriesContainerParams {
  boxes: { [key: string]: EntryStruct[] };
}

export default function EntriesContainer({ boxes }: EntriesContainerParams) {
  const filteredBoxes: { [key: string]: EntryStruct[] } = {};

  for (const key in boxes) {
      if (boxes.hasOwnProperty(key) && key.includes("SideEntry")) {
          const entries = boxes[key].map(entry => {
              const { ...data } = entry;
              data.content = [];
              return data;
          });
          filteredBoxes[key] = entries;
      }
  }


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
      {Object.entries(filteredBoxes).map(([id, entries], i) => {
        return (
          <DroppableContainer
            header={SectionsArray[i]}
            box={entries || []}
            id={id}
          />
        );
      })}
    </div>
  );
}
