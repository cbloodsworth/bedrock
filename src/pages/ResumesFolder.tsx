import React, {useState, useEffect} from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import "../index.css"
import '../styles/ResumesFolder.css'
import Navbar from "../components/Navbar";
import ResumeFolderEntry from "../components/ResumeFolderEntry";
import { Link } from 'react-router-dom';


const ResumesFolder: React.FC = () => {
    return(
        <>
        <Navbar/>
        <div id='ResumeTemplates'>

        </div>
        <h3 style={{marginBottom:"0"}}>Recent Resumes</h3>
        <div id='ResumeEntriesWrapper'>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 1" />
                </Box>
            </Link>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 2" />
                </Box>
            </Link>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 3" />
                </Box>
            </Link>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 4" />
                </Box>
            </Link>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 5" />
                </Box>
            </Link>
            <Link to="/ResumesFolder/Resume" className='ResumeEntryBoxWrapper'>
                <Box className="ResumeEntryBox">
                    <ResumeFolderEntry previewImagePath="/img/previews/output.jpg" documentName="Document 6" />
                </Box>
            </Link>
        </div>
        </>
    )
};

export default ResumesFolder;