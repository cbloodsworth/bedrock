import React, {useState, useEffect} from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import "../index.css"
import '../styles/ResumesFolder.css'
import Navbar from "../components/Navbar";
import ResumeFolderEntry from "../components/ResumeFolderEntry";

const ResumesFolder: React.FC = () => {
    return(
        <>
        <Navbar/>
        <div id='ResumeEntriesWrapper'
          >
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 1" />
            </Box>
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 2" />
            </Box>
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 3" />
            </Box>
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 4" />
            </Box>
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 5" />
            </Box>
            <Box className="ResumeEntryBox">
                <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 6" />
            </Box>
        </div>
        </>
    )
};

export default ResumesFolder;