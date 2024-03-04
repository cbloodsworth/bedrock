import React, { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Box, Grid } from "grommet";
import Resume from "../components/Resume";
import ResumeSection from "../components/ResumeSection";
import SideEntriesContainer from "../components/SideEntriesContainer";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/Resumes.css";
import "../index.css";

import { SectionDataClass } from "../utility/EntryData";

const initialSections = new SectionDataClass();
const initialResumeNodes = initialSections
  .getResumeSections()
  .map((section) => (
    <ResumeSection
      header={section.sectionHeader}
      box={section.entryList}
      id={section.sectionID}
    />
  ));

const Resumes: React.FC = () => {
  const [sections, setSections] = React.useState(initialSections);
  const [resumeNodes, setResumeNodes] =
    React.useState<React.ReactNode[]>(initialResumeNodes);

  /* Helper function to update entries and the actual react components they are associated with */
  const updateSections = (newSections: SectionDataClass) => {
    setSections(newSections);
    setResumeNodes(
      newSections
        .getResumeSections()
        .map((section) => (
          <ResumeSection
            header={section.sectionHeader}
            id={section.sectionID}
            box={section.entryList}
          />
        ))
    );
  };

  const handleDragEnd = (result: DropResult) => {
    var src = result.source;
    var dest = result.destination;

    if (!dest) {
      //not in any droppable area
      return;
    }

    // Source and destination ID
    let srcID = src.droppableId;
    let destID = dest.droppableId;

    // If we dragged a resume section
    if (result.type === "resumeSectionItem") {
      const err = sections.moveSections(src.index, dest.index); // Swap src and dest
      if (err != 0) console.log(sections.getError()); // If there was an error in moving the sections, log it here

      updateSections(sections);
      return;
    }
    // Otherwise, we might have dragged an entrybox
    else if (result.type === "entryBox") {
      const err = sections.moveEntries(srcID, destID, src.index, dest.index);
      if (err != 0) console.log(sections.getError()); // If there was an error in moveEntries, log it here

      updateSections(sections);
      return;
    } else {
      console.log("Warning: Dragging unknown object");
    }
  };

  const handleSavePreview = () => {
    const resumeContainer = document.getElementById("resumeContainerWrapper");
    if (!resumeContainer) {
      console.error("Resume container not found");
      return;
    }

    // Capture the HTML representation of the entire resume container
    const htmlContent = resumeContainer.outerHTML;

    // Send a POST request to the Flask server with the HTML content
    axios
      .post("http://localhost:5000/save-preview", { htmlContent })
      .catch((error) => {
        console.error("Error saving preview:", error);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      handleSavePreview();
    }, 1000);
  }, []);

  useEffect(() => {
    handleSavePreview();
  }, [resumeNodes]);

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", margin: "5vh 0" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid columns={["78%", "20%"]} gap="2%" style={{ marginLeft: "2%" }}>
            <Box>
              <Resume children={resumeNodes} />
            </Box>
            <Box style={{ width: "100%", right: "0" }}>
              <SideEntriesContainer sections={sections.getSidebarSections()} />
            </Box>
          </Grid>
        </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;
