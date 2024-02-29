import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Box } from "grommet";
import Navbar from "../components/Navbar";
import "../styles/Homepage.css";
import "../index.css";
import resumeBuilderImage from "../../src/assets/homepageResumeBuilder.png";

const Homepage: React.FC = () => {
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
  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    fetch("http://127.0.0.1:5000/user-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) =>
        console.error("Error fetching user information:", error)
      );
  });
  return (
    <>
      <Navbar />
      <h1>DynaCV: A Bedrock Product</h1>
      {userInfo ? <h2> Welcome {userInfo.given_name}!</h2> : <></>}
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
