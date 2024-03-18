import Navbar from "../components/Navbar";
import {AllDataClass } from "../utility/AllEntryData";
import React, { useEffect } from "react";
import ResumeSection from "../components/ResumeSection";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Resume from "../components/Resume";

import "../styles/UserPage.css"
const initialSections = new AllDataClass();

const allSections = initialSections.getSections();

interface SectionMap {
    [header: string]: {
      sectionHeader: string;
      entryList: any[]; 
    };
  }


  const sectionMap = allSections.reduce((acc: SectionMap, section) => {
    const header = section.sectionHeader;
    if (!acc[header]) {
      acc[header] = {
        sectionHeader: header,
        entryList: [],
      };
    }
    acc[header].entryList.push(...section.entryList);
    return acc;
  }, {} as SectionMap);

const entries = Object.values(sectionMap)
.filter(section => !(section.sectionHeader === "Uncategorized" && section.entryList.length === 0))
.map((section) => (
  <ResumeSection
    header={section.sectionHeader}
    box={section.entryList}
    id={section.sectionHeader}
    editEntry={true}
  />
));


const UserPage = () => {
    const [sections, setSections] = React.useState(initialSections);
    const [allEntries, setAllEntries] = React.useState<React.ReactNode[]>(entries)

    const updateSections = (newSections: AllDataClass) => {
        setSections(newSections);
        setAllEntries(
          newSections
            .getSections()
            .filter(section => !(section.sectionHeader === "Uncategorized" && section.entryList.length === 0))
            .map((section) => (
              <ResumeSection
                header={section.sectionHeader}
                id={section.sectionHeader}
                box={section.entryList}
              />
            ))
        );
      };

    const handleDragEnd = (result: DropResult) => {
        const src = result.source;
        const dest = result.destination;
    
        if (!dest) {
            // Not in any droppable area
            return;
        }
    
        // Source and destination IDs
        const srcID = src.droppableId;
        const destID = dest.droppableId;
    
        // If we dragged a resume section
    if (result.type === "resumeSectionItem") {
        // const err = sections.moveSections(src.index, dest.index)
        // if (err != 0) console.log(sections.getError())
        updateSections(sections)

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
    
    const addNewEntry = () => {
      setAllEntries(() => {
        const currSections = new AllDataClass();
        currSections.addDefaultEntry();
        const updatedSections = currSections.getSections();
        const uncategorizedSection = document.getElementById("Uncategorized");
        if (uncategorizedSection) {
          window.scrollTo(0, uncategorizedSection.getBoundingClientRect().top + window.scrollY +  uncategorizedSection.scrollHeight);
          // uncategorizedSection.scrollIntoView({block : "end"})
        }
        
        return updatedSections.map((section, index) => (
          <ResumeSection
              key={section.sectionHeader + index}
              header={section.sectionHeader}
              box={section.entryList}
              id={section.sectionHeader}
          />
      ));
      })
    }
    const addNewSection = () => {
        setAllEntries(prevEntries => {
            const newSections = new AllDataClass();
            newSections.addSection("New");
    
            const updatedSections = newSections.getSections(); // Assuming getSections returns the updated sections
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            });
            if (updatedSections) {
                return updatedSections
                .filter(section => !(section.sectionHeader === "Uncategorized" && section.entryList.length === 0))
                .map((section, index) => (
                    <ResumeSection
                        key={section.sectionHeader + index}
                        header={section.sectionHeader}
                        box={section.entryList}
                        id={section.sectionHeader}
                    />
                ));
            } else {
                return prevEntries;
            }
        });
    };


    return(
        <>
            <Navbar />
            <div className="editEntriesWrapper">
                <button className='newSection' onClick={addNewSection}>Add New Section</button>
                <button className='newSection'onClick={addNewEntry}>Add New Entry</button>
            </div>
            <div className="resumeGrid">
                <DragDropContext onDragEnd={handleDragEnd}>
                {allEntries.map((section, index) => {
    if (React.isValidElement(section)) {
        return (
              <Resume
                  key={index}
                  children={section}
                  editEntry={true}
                  id={String(section.props.header)}
                  addNewEntry={addNewEntry}
              />
          );
        }
        return null;
    })}
                </DragDropContext>
            </div>
        </>
    )
}

export default UserPage;