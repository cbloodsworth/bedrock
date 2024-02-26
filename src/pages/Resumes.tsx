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

import { EntryStruct, EntryData as Entries } from "../utility/EntryData";

const resumeData = [
  <DroppableContainer
    header="Education"
    box={Entries.EntryBox1 || []}
    id="EntryBox1"
  />,
  <DroppableContainer
    header="Projects"
    box={Entries.EntryBox3 || []}
    id="EntryBox3"
  />,
  <DroppableContainer
    header="Experience"
    box={Entries.EntryBox4 || []}
    id="EntryBox4"
  />,
];

const Resumes: React.FC = () => {
  const [entries, setEntries] = React.useState(Entries);
  const [resumeChildren, setResumeChildren] =
    React.useState<React.ReactNode[]>(resumeData);

  const updateResumeChildren = () => {
    const updatedResumeChildren = resumeChildren.map((child) => {
      if (React.isValidElement(child) && child.type === DroppableContainer) {
        const { id } = child.props;
        const box = (entries as any)[id] || [];
        return (
          <DroppableContainer header={child.props.header} box={box} id={id} />
        );
      }
      return child;
    });
    setResumeChildren(updatedResumeChildren);
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

    let srcDrop = src.droppableId as keyof typeof entries;
    let destDrop = dest.droppableId as keyof typeof entries;

    if (result.type === "resumeSectionItem") {
      const updatedResumeChildren = Array.from(resumeChildren);
      const [removed] = updatedResumeChildren.splice(src.index, 1);
      updatedResumeChildren.splice(dest.index, 0, removed);
      setResumeChildren(updatedResumeChildren);
    } else if (result.type.includes("entryBox")) {
      if (!destDrop.startsWith("EntryBox")) {
        const srcArrayCopy = [...entries[srcDrop]];
        srcArrayCopy.splice(src.index, 1);
        setEntries({
          ...entries,
          [srcDrop]: srcArrayCopy,
        });
        return;
      }

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
              <EntriesContainer box={entries.EntryBox2 || []} id="EntryBox2" />
            </Box>
          </Grid>
        </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;
