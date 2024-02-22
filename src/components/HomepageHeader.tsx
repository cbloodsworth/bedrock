import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const handleClick = (action: string) => {
    console.log(action);
  };

  const handleLoginClick = async () => {
    console.log("Log in button clicked");
    window.location.href = "http://127.0.0.1:5000/login";
  };

  const handleSignUpClick = async () => {
    console.log("Sign Up button clicked");
    window.location.href = "http://127.0.0.1:5000/login";
  };
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    // Make a request to your back end to retrieve user information
    fetch("http://127.0.0.1:5000/user-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookies if your back end and front end are on different domains
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) =>
        console.error("Error fetching user information:", error)
      );
  }, []);
  return (
    <header style={{ width: "100%" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "2%",
        }}
      >
        <div
          style={{
            left: "10px",
          }}
        >
          <Link className="link-item" to="/">
            <button style={{ marginLeft: "10px", marginRight: "10px" }}>
              Home
            </button>
          </Link>
          <Link className="link-item" to="/Resumes">
            <button style={{ marginLeft: "10px", marginRight: "10px" }}>
              Resumes
            </button>
          </Link>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => handleClick("Button 3")}
          >
            Button 3
          </button>
        </div>
        <div>
          <button onClick={() => handleLoginClick()}>
            {" "}
            {userInfo ? `Welcome ${userInfo.email}!` : "Login"}
          </button>
          <button
            onClick={() => handleSignUpClick()}
            style={{ marginLeft: "10px", marginRight: "10px" }}
          >
            {userInfo ? `Welcome ${userInfo.email}!` : "Sign Up"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
