import React from "react";
import { Box } from "grommet";
import { Grid } from "grommet";
import '../styles/ResumeFolderEntry.css'

interface ResumeFolderEntryProps {
  previewImagePath: string;
  documentName: string; // New prop for the name
}

const ResumeFolderEntry: React.FC<ResumeFolderEntryProps> = ({ previewImagePath, documentName }) => {
  return (
    <Box className='documentEntryWrapper' height='100%'>
        <Grid fill rows={['80%', '20%']} gap='0%'> 
        <div className='documentPreviewWrapper' style={{ backgroundImage: `url(${previewImagePath})` }}/>
        <div className='documentName'>
            <b>{documentName}</b>
        </div>
      </Grid>
    </Box>
  );
};

export default ResumeFolderEntry;
