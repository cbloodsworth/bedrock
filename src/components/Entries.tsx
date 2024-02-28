import DroppableContainer from "./DroppableContainer";
import { EntryStruct } from "../utility/EntryData";

interface EntriesContainerParams {
  box: EntryStruct[];
  id: string;
}

export default function EntriesContainer({ box, id }: EntriesContainerParams) {
  // This just groups box by section
  const groupedBox = box.reduce(
    (acc: Record<string, EntryStruct[]>, entry: EntryStruct) => {
      if (!acc[entry.section]) {
        acc[entry.section] = [];
      }
      acc[entry.section].push(entry);
      return acc;
    },
    {}
  );

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
        zIndex: 1,
      }}
    >
      {Object.entries(groupedBox).map(([section, entries]) => (
        <DroppableContainer header={section} box={entries || []} id={id} />
      ))}
    </div>
  );
}
