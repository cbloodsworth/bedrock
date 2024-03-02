import React, { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet";
import Resume from "../components/Resume";
import ResumeSection from "../components/ResumeSection";
import SideEntriesContainer from "../components/SideEntriesContainer";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/Resumes.css";
import "../index.css";

import { SectionData as Sections, SectionMap } from "../utility/EntryData";

const resumeData = Object.entries(Sections)
  .filter(([sectionID, _]) => {
    return sectionID.includes("REB");
  })
  .map(([sectionID, section]) => {
    return (
      <ResumeSection
        header={section.sectionHeader}
        box={section.entryList}
        id={sectionID}
      />
    );
  });

console.log(resumeData);

const Resumes: React.FC = () => {
  const [sections, setSections] = React.useState(Sections); // NOTE: it is not recommended to call setEntries, use updateEntries instead
  const [resumeChildren, setResumeChildren] =
    React.useState<React.ReactNode[]>(resumeData);

  /* Helper function to update entries and the actual react components they are associated with */
  const updateSections = (new_sections: SectionMap) => {
    setSections(new_sections);
    setResumeChildren(
      Object.entries(new_sections).map(([sectionID, section]) => {
        return sectionID.includes("R") ? (
          <ResumeSection
            header={section.sectionHeader}
            id={sectionID}
            box={section.entryList}
          />
        ) : (
          <></>
        );
      })
    );
  };

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

    // If we dragged a resume section
    if (result.type === "resumeSectionItem") {
      const updatedResumeChildren = Array.from(resumeChildren);
      const [removed] = updatedResumeChildren.splice(src.index, 1);
      updatedResumeChildren.splice(dest.index, 0, removed);
      setResumeChildren(updatedResumeChildren);
    }
    // Otherwise, we might have dragged an entrybox
    else if (result.type === "entryBox") {
      if (!destDrop.includes("EB")) {
        const srcArrayCopy = [...sections[srcDrop].entryList];
        srcArrayCopy.splice(src.index, 1);
        updateSections(sections);
        return;
      }

      //stayed in original droppable area
      if (srcDrop === destDrop) {
        const updatedSections = { ...sections }; // temp so we don't modify sections directly (is this necessary i wonder?)

        // Moves entry from one position in the entrybox to another
        const [removed] = updatedSections[srcDrop].entryList.splice(
          src.index,
          1
        ); // removes entry
        updatedSections[srcDrop].entryList.splice(dest.index, 0, removed); // reinserts it at the new spot

        updateSections(updatedSections);
        return;
      }

      // Otherwise, it must have moved to new droppable area
      const srcEntryBox = [...sections[srcDrop].entryList];
      const destEntryBox = [...sections[destDrop].entryList];

      const [removedItem] = srcEntryBox.splice(src.index, 1); // Remove the entry from the source entry box
      destEntryBox.splice(dest.index, 0, removedItem); // Inserts the removed item into the destination entry box

      // const updatedEntries = {
      //   ...sections,
      //   [srcDrop]: srcEntryBox,
      //   [destDrop]: destEntryBox,
      // };

      sections[srcDrop].entryList = srcEntryBox;
      sections[destDrop].entryList = destEntryBox;

      updateSections(sections);
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
  }, [resumeChildren]);

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", margin: "5vh 0" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid columns={["78%", "20%"]} gap="2%" style={{ marginLeft: "2%" }}>
            <Box>
              <Resume children={resumeChildren} />
            </Box>
            <Box style={{ width: "100%", right: "0" }}>
              <SideEntriesContainer sections={sections} />
            </Box>
          </Grid>
        </DragDropContext>
      </div>
    </>
  );
};

export default Resumes;
