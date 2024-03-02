import React from "react";
import { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { Grid, Box } from "grommet";

import Navbar from "../components/Navbar";

import { UserInfoProvider, useUserContext } from "../contexts/userContext";

import "../styles/Homepage.css";
import "../index.css";

import resumeBuilderImage from "../../src/assets/homepageResumeBuilder.png";

interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
interface UserContextType {
  userInfo: UserInfo | null;
  logout: () => void;
}
const UserGreeting: React.FC = () => {
  const userContext: UserContextType | null = useUserContext();
  const userInfo = userContext?.userInfo;
  return userInfo?.given_name ? (
    <h2> Welcome {userInfo.given_name}!</h2>
  ) : (
    <h2>&nbsp;</h2>
  );
};
const Homepage: React.FC = () => {
  return (
    <>
      <Navbar />
      <h1>DynaCV: A Bedrock Product</h1>
      <UserInfoProvider>
        <UserGreeting />
      </UserInfoProvider>
      <div className="homepageContainer" id="resumeHomePageContainer">
        <Grid columns={["50%", "50%"]} gap="none" style={{ height: "100%" }}>
          <Box className="containerBoxResume">
            <h2>Begin Making Your Resume Here</h2>
            <Link to="/Resumes" className="createResumeButton">
              Create your Resume
            </Link>
          </Box>
          <Box className="containerBoxResume">
            <img
              id="resumeImage"
              src={resumeBuilderImage}
              alt="resume builder"
            />
          </Box>
        </Grid>
      </div>
    </>
  );
};

export default Homepage;
