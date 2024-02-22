import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box} from 'grommet';
import Header from '../components/HomepageHeader';
import '../styles/Homepage.css'
import '../index.css'
import resumeBuilderImage from '../../src/assets/homepageResumeBuilder.png'

const Homepage: React.FC = () => {

    return (
        <>
            <Header/>
            <h1>DynaCV: A Bedrock Product</h1>
            
            <div className="homepageContainer" id='resumeHomePageContainer'>
                <Grid columns={["50%", "50%"]} gap="none"  style={{ height: "100%" }}>
                    <Box className='containerBoxResume'>
                        <h2>Begin Making Your Resume Here</h2>
                        <Link to="/Resumes" className="createResumeButton">Create your Resume</Link>
                    </Box>
                    <Box className='containerBoxResume'>
                            <img id='resumeImage' src={resumeBuilderImage} alt="resume builder" />
                    </Box>
                </Grid>
            </div>
            
        </>
    )
}

export default Homepage
