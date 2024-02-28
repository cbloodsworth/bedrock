import React from "react";
import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const loggedInRef = useRef(false);

  const handleClick = (action: string) => {
    console.log(action);
  };
  useEffect(() => {
    fetch("http://127.0.0.1:5000/user-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        loggedInRef.current = true;
      })
      .catch((error) =>
        console.error("Error fetching user information:", error)
      );
  }, []);
  return (
    <header style={{ width: "100%" }}>
      <nav>
        <div>
          <Link className="link-item" to="/">
            <button className="navbarButton">Home</button>
          </Link>
          <Link className="link-item" to="/Resumes">
            <button className="navbarButton">Resumes</button>
          </Link>
          <button
            className="navbarButton"
            onClick={() => (loggedInRef.current = false)}
          >
            Button 3
          </button>
        </div>
        <div>
          {loggedInRef.current ? (
            <Link className="link-item" to="/Login">
              <button className="navbarButton">Login</button>
            </Link>
          ) : (
            <Link className="link-item" to="/">
              <button className="navbarButton">Logout</button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default memo(Navbar);
