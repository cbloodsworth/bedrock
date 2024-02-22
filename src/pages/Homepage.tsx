import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box} from 'grommet';
import Header from '../components/HomepageHeader';
import '../styles/Homepage.css'
import '../index.css'
import resumeBuilderImage from '../../src/assets/homepageResumeBuilder.png'

const Homepage: React.FC = () => {
    const handleLoginClick = () => {
        console.log("Login button clicked");
      };
    
      const handleSignUpClick = () => {
        console.log("Sign Up button clicked");
      };

    return (
        <>
            <Header onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick}/>
            <h1>DynaCV: A Bedrock Product</h1>
            
            <div className="homepageContainer" id='resumeHomePageContainer'>
                <Grid columns={["40%", "55%"]} gap="medium">
                    <Box style={{
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    textAlign: "center",
                 }}>
                        <h2>Begin Making Your Resume Here</h2>
                        <Link to="/Resumes" className="createResumeButton">Create your Resume</Link>
                    </Box>
                    <Box>
                        <div>
                            <img id='resumeImage' src={resumeBuilderImage} alt="resume builder" />
                        </div>
                    </Box>
                </Grid>
            </div>
            
        </>
    )
}

export default Homepage
