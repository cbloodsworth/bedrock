import React from "react";
import { Link } from "react-router-dom";


const Header: React.FC = () => {
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
        <nav style={{
            display: "flex",
            justifyContent: 'space-between',
            alignItems: 'center', 
            width: "100%",
            marginBottom: "2%"
        }}>
            <div style={{
                left: "10px"
            }}>
                <Link className="link-item" to='/'><button style={{ marginLeft: '10px',  marginRight: '10px'}}>Home</button></Link>
                <Link className="link-item" to='/Resumes'><button style={{ marginLeft: '10px',  marginRight: '10px'}}>Resumes</button></Link>
                <button style={{ marginLeft: '10px'}} onClick={() => handleClick("Button 3")}>Button 3</button> 
            </div>
            <div>
                <button onClick={() => handleLoginClick()}>Login</button>
                <button onClick={() => handleSignUpClick()} style={{ marginLeft: '10px',  marginRight: '10px'}}>Sign Up</button>
            </div>
        </nav>
    </header>
  );
};

export default Header;
