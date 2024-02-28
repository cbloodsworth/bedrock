import React, {useEffect} from "react"; 
import { DragDropContext, DropResult } from "react-beautiful-dnd"; 
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; 
import Resume from "../components/Resume";
import EntriesContainer from "../components/Entries";
import Navbar from "../components/Navbar";
import axios from 'axios';
import "../styles/Resumes.css";
import "../index.css"



const createEntry = (id: string, header: string, content: string[]) => {
  return {
    id: id,
    header: header,
    text: content,
  };
};

const Entries = {
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
  />
]

const Resumes: React.FC = () => {
  const [entries, setEntries] = React.useState(Entries);
  const [resumeChildren, setResumeChildren] = React.useState<React.ReactNode[]>(resumeData);

  const updateResumeChildren = () => {
    const updatedResumeChildren = resumeChildren.map(child => {
      if (React.isValidElement(child) && child.type === DroppableContainer) {
        const { id } = child.props;
        const box = (entries as any)[id] || [];
        return <DroppableContainer header={child.props.header} box={box} id={id} />;
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
    }
    else if(result.type.includes("entryBox")){
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

  const handleSavePreview = () => {
    
    const resumeContainer = document.getElementById('resumeContainerWrapper');
    if (!resumeContainer) {
      console.error('Resume container not found');
      return;
    }
  
    // Capture the HTML representation of the entire resume container
    const htmlContent = resumeContainer.outerHTML;
  
    // Send a POST request to the Flask server with the HTML content
    axios.post('http://localhost:5000/save-preview', { htmlContent })
      .catch(error => {
        console.error('Error saving preview:', error);
      });
  };
  

  useEffect(() => {
    setTimeout(() =>{
        handleSavePreview();
    }, 1000)
  }, []); 

  
  useEffect(() => {
    handleSavePreview();
  }, [resumeChildren]); 
  

  return (
    <>
      <Navbar/>
      <div style={{width:"100%", marginBottom: "2vh"}}>
      <DragDropContext onDragEnd={handleDragEnd} >
        <div style={{marginTop:"2%"}}>
          <Grid columns={["78%", "20%"]} gap="2%" style={{marginLeft:"2%"}}>
          <Box id='resumeContainerWrapper'>
            <Resume children={resumeChildren} />
          </Box>
          <Box style={{width: "100%", right: '0'}}>
            <EntriesContainer
              box={entries.EntryBox2 || []}
              id="EntryBox2"
            />
          </Box>
        </Grid>
        </div>
      </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;