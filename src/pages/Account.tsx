import React from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import Resume from "../components/Resume";
import "../styles/Account.css";
import BlockBox from "../components/BlockBox";

const createEntry = (id: string, header: string, content: string) => {
  return {
    id: id,
    header: header,
    text: content,
  };
};

const Entries = {
  EntryBox1: ["1", "2", "3"].map((id) =>
    createEntry(id, `Entry ${id}`, `Text ${id}`)
  ),
  EntryBox2: ["4", "5", "6"].map((id) =>
    createEntry(id, `Entry ${id}`, `Text ${id}`)
  ),
  EntryBox3: ["7", "8", "9"].map((id) =>
    createEntry(id, `Entry ${id}`, `Text ${id}`)
  ),
  EntryBox4: ["10", "11", "12"].map((id) =>
    createEntry(id, `Entry ${id}`, `Text ${id}`)
  ),
};

const Account: React.FC = () => {
  const [entries, setEntries] = React.useState(Entries);

  const handleDragEnd = (result: DropResult) => {
    console.log("here");
    const src = result.source;
    const dest = result.destination;
    console.log(result);

    if (!dest) {
      //not in any droppable area
      return;
    }

    let srcDrop = src.droppableId as keyof typeof entries;
    let destDrop = dest.droppableId as keyof typeof entries;

    //stayed in original droppable area
    if (src.droppableId === dest.droppableId) {
      const res = [...entries[srcDrop]];
      const [removed] = res.splice(src.index, 1);
      res.splice(dest.index, 0, removed);
      const updatedEntries = { ...entries };
      updatedEntries[srcDrop] = res;
      setEntries({ ...updatedEntries });
      return;
    }

    //Moved to new droppable area
    console.log("SRC: ", entries[srcDrop]);
    console.log("DEST: ", entries[destDrop]);

    const srcArrayCopy = [...entries[srcDrop]];
    const destArrayCopy = [...entries[destDrop]];

    const [removedItem] = srcArrayCopy.splice(src.index, 1);
    destArrayCopy.splice(dest.index, 0, removedItem);

    const updatedEntries = {
      ...entries,
      [srcDrop]: srcArrayCopy,
      [destDrop]: destArrayCopy,
    };

    setEntries({ ...updatedEntries });
    console.log(entries);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid columns={["20%", "50%", "20%"]} gap="medium">
        <Grid rows={["20%", "20%", "20%"]} gap="3vw">
          <BlockBox name="Education"></BlockBox>
          <BlockBox name="Experience"></BlockBox>
          <BlockBox name="Projects"></BlockBox>
        </Grid>
        <Box>
          <Resume>
            <DroppableContainer
              text="Header 1"
              box={entries.EntryBox1 || []}
              id="EntryBox1"
            />
            <DroppableContainer
              text="Header 2"
              box={entries.EntryBox3 || []}
              id="EntryBox3"
            />
            <DroppableContainer
              text="Header 3"
              box={entries.EntryBox4 || []}
              id="EntryBox4"
            />
          </Resume>
        </Box>
        <Box>
          <DroppableContainer
            text="Entries"
            box={entries.EntryBox2 || []}
            id="EntryBox2"
          />
        </Box>
      </Grid>
    </DragDropContext>
  );
};

export default Account;
