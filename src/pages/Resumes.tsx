import React from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import Resume from "../components/Resume";
import "../styles/Resumes.css";
import "../index.css"
import EntriesContainer from "../components/Entries";
import Navbar from "../components/Navbar";

const createEntry = (id: string, header: string, content: string[]) => {
  return {
    id: id,
    header: header,
    text: content,
  };
};

const Entries = {
  // EntryBox1: ["1", "2", "3"].map((id) =>
  //   createEntry(id, `Entry ${id}`, `Text ${id}`)
  // ),
  EntryBox1: [
    createEntry("2", "University of Florida | Gainesville, FL", ["B.S in Computer Science and Minor in mathematics | GPA: 4.0/4.0"]),
  ],
  EntryBox2: [
    createEntry("3", "Personal Website | React, Python", ["Created customized personal website as a portfolio"]),
    createEntry("4", "ML Model for Image Classification | TensorFlow", ["Developed a convolutional neural network (CNN) that achieved an accuracy of 95% on the test dataset"]), 
    createEntry("5", "Autoencoder | Python, Pytorch", ["Implemented autoencoder to compress and decompress images from the MNIST dataset"]),
  ],
  EntryBox4: [
    createEntry("7", "Software Engineer Intern | Bank of America (2023)", ["Helped create API call for new feature and used tools like Splunk to review code defects"]),
    createEntry("8", "Computer Science Tutor | University of Florida (Fall 2022 - Fall 2023)", ["Tutored students in introductory Computer Science classes such as Data Structures and intro to programming"]),
    createEntry("9", "Software Engineer | Bank of America (2024)", ["Worked on API calls using Java"])
  ],
  EntryBox3: [
    createEntry("10", "Interpreter | Junit, Java, Git", ["Created an interpreter consisting of a Lexer, Parser, Interpreter, Analyzer and Generator",
  "Implemented more than 300 unit tests using Junit to ensure perfect functionality"]),
    createEntry("11", "SFML Piano | SFML, C++, Git", ["Used SFML to create a piano visualizer that interprets midi files and then shows the notes falling"]),
    createEntry("12", "Senior Project | React, Typescript, Git", ["Used react to create a resume drag and drop website",
      "worked on the frontend interface using mostly Typescript"])
  ],
};

const Resumes: React.FC = () => {
  const [entries, setEntries] = React.useState(Entries);

  const handleDragEnd = (result: DropResult) => {
    const src = result.source;
    const dest = result.destination;

    if (!dest) {
      //not in any droppable area
      return;
    }

    let srcDrop = src.droppableId as keyof typeof entries;
    let destDrop = dest.droppableId as keyof typeof entries;

    if (!destDrop.startsWith("EntryBox")) {
      // Entry was dropped in a DroppableContainer
      console.log("Entry was dropped in DroppableContainer:", destDrop);
      const srcArrayCopy = [...entries[srcDrop]];
      srcArrayCopy.splice(src.index, 1);
      setEntries({
        ...entries,
        [srcDrop]: srcArrayCopy,
      });
      // Your logic for handling DroppableContainer drop
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
    // console.log("SRC: ", entries[srcDrop]);
    // console.log("DEST: ", entries[destDrop]);

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
  };

  return (
    <>
      <Navbar/>
      <div style={{width:"100%"}}>
      <DragDropContext onDragEnd={handleDragEnd} >
          <Grid columns={["74%", "20%"]} gap="5%" style={{marginLeft:"5%"}}>
            {/* <Grid rows={["20%", "20%", "20%"]} gap="3vw">
              <BlockBox name="Education" id='educationBox'></BlockBox>
              <BlockBox name="Experience" id='experienceBox' ></BlockBox>
              <BlockBox name="Projects" id='indexBox'></BlockBox>
            </Grid> */}
          <Box>
            <Resume>
              <DroppableContainer
                text="Education"
                box={entries.EntryBox1 || []}
                id="EntryBox1"
              />
              <DroppableContainer
                text="Projects"
                box={entries.EntryBox3 || []}
                id="EntryBox3"
              />
              <DroppableContainer
                text="Experience"
                box={entries.EntryBox4 || []}
                id="EntryBox4"
              />
            </Resume>
          </Box>
          <Box style={{width: "100%", right: '0'}}>
            <EntriesContainer
              box={entries.EntryBox2 || []}
              id="EntryBox2"
            />
          </Box>
        </Grid>
      </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;
