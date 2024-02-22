import DroppableContainer from "./DroppableContainer";

interface Container {
  box: { id: string; header: string; text: string }[];
  id: string;
}

export default function EntriesContainer({box, id }: Container) {
    return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          border: "2px solid #111111",
          backgroundColor: "#f0f0f0",
          height: "auto"
          }}>
          <DroppableContainer 
              text="Entries"
              box={box || []}
              id={id}
            />
          </div>
    );
  }