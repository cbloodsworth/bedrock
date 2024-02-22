import React from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  const handleClick = (action: string) => {
    console.log(action);
  };

  const handleLoginClick = () => {
    console.log("Login button clicked");
  };

  const handleSignUpClick = () => {
    console.log("Sign Up button clicked");
  };
 
  return (

    <header style={{width:"100%"}}>
        <nav>
            <div>
                <Link className="link-item" to='/'><button className="navbarButton">Home</button></Link>
                <Link className="link-item" to='/Resumes'><button className="navbarButton">Resumes</button></Link>
                <button className="navbarButton" onClick={() => handleClick("Button 3")}>Button 3</button> 
            </div>
            <div>
                <button className="navbarButton"onClick={() => handleLoginClick()}>Login</button>
                <button onClick={() => handleSignUpClick()} className="navbarButton">Sign Up</button>
            </div>
        </nav>
    </header>
  );
};

export default Navbar;
