import Navbar from "../components/Navbar";
import { Grid, Box } from "grommet";
import SideEntriesContainer from "../components/SideEntriesContainer";
import { SectionDataClass } from "../utility/EntryData";
import React, { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import "../styles/UserPage.css"
const initialSections = new SectionDataClass();

const UserPage = () => {
    const [sections, setSections] = React.useState(initialSections);

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
        setSections(() => {  //not properly updating otherwise idk why
            const newSections = new SectionDataClass();
    
            const err = newSections.moveEntries(srcID, destID, src.index, dest.index);
            if (err !== 0) console.log(newSections.getError());
    
            return newSections;
        });
        return;
    }

    const addNewSection = () => {
        setSections(() => {
            const newSections = new SectionDataClass();
            const err = newSections.addSection("New");
            if (err !== 0) console.log(newSections.getError());
            return newSections;
        })
    }

    return(
        <>
            <Navbar />
            <div className="editEntriesWrapper">
                <button className='newSection' onClick={addNewSection}>Add New Section</button>
                <button className='newSection'>Add New Entry</button>
            </div>
            <div className="boxesWrapper">
                <DragDropContext onDragEnd={handleDragEnd}>
                    {sections.getSidebarSections().map((section, index) => (
                        <Box key={index} className="entryBoxWrapper">
                            <SideEntriesContainer sections={[section]} />
                        </Box>
                    ))}
                </DragDropContext>
            </div>
        </>
    )
}

export default UserPage;