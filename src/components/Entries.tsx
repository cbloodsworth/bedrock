import DroppableContainer from "./DroppableContainer";

interface Container {
  box: { id: string; header: string; text: string[] }[];
  id: string;
}

export default function EntriesContainer({box, id }: Container) {
  const emptyTextBox = box.map(item => ({
    ...item,
    text: []
  }))

    return (
        <div style={{
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
          }}>
          <DroppableContainer 
              header="Entries"
              box={emptyTextBox || []}
              id={id}
            />
          </div>
    );
  }