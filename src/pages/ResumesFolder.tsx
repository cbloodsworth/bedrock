import React from "react"; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd"; //Droppable
import DroppableContainer from "../components/DroppableContainer";
import { Box, Grid } from "grommet"; //Card, Heading, Main, CardHeader
import Resume from "../components/Resume";
import "../index.css"
import Navbar from "../components/Navbar";

const ResumesFolder: React.FC = () => {
    return(
        <>
        <Navbar/>
        <Grid columns={["45%", "45%"]} gap="10%">
        <Box>
            Box 1
        </Box>
        <Box>
            Box 2
        </Box>
        </Grid>
        </>
    )
};

export default ResumesFolder;