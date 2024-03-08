import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { UserInfoProvider, useUserContext } from "../contexts/userContext";

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

const LogButton: React.FC = () => {
  const userContext: UserContextType | null = useUserContext();
  const userInfo = userContext?.userInfo;
  const handleGoogleLogout = () => {
    userContext?.logout();
    window.location.href = `http://${window.location.hostname}/api/logoutGoogle`;
  };
  return (
    <>
      <div>
        {!userInfo?.given_name ? (
          <Link className="link-item" to="/Login">
            <button className="navbarButton">Login</button>
          </Link>
        ) : (
          <Link className="link-item" to="/">
            <button
              className="navbarButton"
              onClick={() => handleGoogleLogout()}
            >
              Logout
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

const Navbar: React.FC = () => {
  return (
    <header style={{ width: "100%" }}>
      <nav>
        <div>
          <Link className="link-item" to="/">
            <button className="navbarButton">Home</button>
          </Link>
          <Link className="link-item" to="/ResumesFolder">
            <button className="navbarButton">Resumes</button>
          </Link>
          <button className="navbarButton">Button 3</button>
        </div>
        <UserInfoProvider>
          <LogButton />
        </UserInfoProvider>
      </nav>
    </header>
  );
};

export default Navbar;
