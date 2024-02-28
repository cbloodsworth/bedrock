import React from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import Resume from "../components/Resume";
import "../styles/Resumes.css";
import "../index.css";
import EntriesContainer from "../components/Entries";
import Navbar from "../components/Navbar";

import { SectionsArray, EntryData as Entries } from "../utility/EntryData";

const resumeData = [
  <DroppableContainer
    header="Education"
    box={Entries.ResumeEntryBox1 || []}
    id="ResumeEntryBox1"
  />,
  <DroppableContainer
    header="Experience"
    box={Entries.ResumeEntryBox2 || []}
    id="ResumeEntryBox2"
  />,
  <DroppableContainer
    header="Projects"
    box={Entries.ResumeEntryBox3 || []}
    id="ResumeEntryBox3"
  />,
];

const Resumes: React.FC = () => {
  const [entries, setEntries] = React.useState(Entries);
  const [resumeChildren, setResumeChildren] =
    React.useState<React.ReactNode[]>(resumeData);

  // Triggers re-render
  const updateResumeChildren = () => {
    setResumeChildren(
      resumeChildren.map((child) => {
        if (React.isValidElement(child) && child.type === DroppableContainer) {
          const { id } = child.props;
          const box = (entries as any)[id] || [];
          return (
            <DroppableContainer header={child.props.header} box={box} id={id} />
          );
        }
        return child;
      })
    );
  };

  //when entries changed, call updateResume
  React.useEffect(() => {
    updateResumeChildren();
  }, [entries]);

  const handleDragEnd = (result: DropResult) => {
    var src = result.source;
    var dest = result.destination;

    if (!dest) {
      //not in any droppable area
      return;
    }

    // Refers to EntryBox{x}
    let srcDrop = src.droppableId;
    let destDrop = dest.droppableId;

    console.log(result);

    // If we dragged a resume section
    if (result.type === "resumeSectionItem") {
      const updatedResumeChildren = Array.from(resumeChildren);
      const [removed] = updatedResumeChildren.splice(src.index, 1);
      updatedResumeChildren.splice(dest.index, 0, removed);
      setResumeChildren(updatedResumeChildren);
    }
    // Otherwise, we might have dragged an entrybox
    else if (result.type === "entryBox") {
      if (!destDrop.includes("EntryBox")) {
        const srcArrayCopy = [...entries[srcDrop]];
        srcArrayCopy.splice(src.index, 1);
        setEntries({
          ...entries,
          [srcDrop]: srcArrayCopy,
        });
        return;
      }

      //stayed in original droppable area
      if (srcDrop === destDrop) {
        const updatedEntries = { ...entries }; // temp so we don't modify entries directly (is this necessary i wonder?)

        // Moves entry from one position in the entrybox to another
        const [removed] = updatedEntries[srcDrop].splice(src.index, 1); // removes entry
        updatedEntries[srcDrop].splice(dest.index, 0, removed); // reinserts it at the new spot

        setEntries({ ...updatedEntries });
        return;
      }

      // Otherwise, it must have moved to new droppable area
      const srcEntryBox = [...entries[srcDrop]];
      const destEntryBox = [...entries[destDrop]];

      const [removedItem] = srcEntryBox.splice(src.index, 1); // Remove the entry from the source entry box
      destEntryBox.splice(dest.index, 0, removedItem); // Inserts the removed item into the destination entry box

      const updatedEntries = {
        ...entries,
        [srcDrop]: srcEntryBox,
        [destDrop]: destEntryBox,
      };

      setEntries(updatedEntries);
    } else {
      console.log("Warning: Dragging unknown object");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "100%" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid columns={["78%", "20%"]} gap="2%" style={{ marginLeft: "2%" }}>
            <Box>
              <Resume children={resumeChildren} />
            </Box>
            <Box style={{ width: "100%", right: "0" }}>
              <EntriesContainer boxes={entries} />
            </Box>
          </Grid>
        </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;
