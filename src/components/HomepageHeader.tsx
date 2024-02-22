import React from "react";

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick }) => {
  const handleClick = (action: string) => {
    // Handle button click based on action
    console.log(`Button ${action} clicked`);
  };

  return (
    <header style={{width:"100%"}}>
        <nav style={{
            display: "flex",
            justifyContent: 'space-between', // align items to the left and right edges
            alignItems: 'center', // vertically center items
            width: "100%",
        }}>
            <div style={{
                left: "10px"
            }}>
            <button onClick={() => handleClick("Button 1")} style={{ marginLeft: "10px", marginRight: '10px' }}>Button 1</button>
            <button onClick={() => handleClick("Button 2")} style={{ marginRight: '10px' }}>Button 2</button>
            <button onClick={() => handleClick("Button 3")}>Button 3</button>
            </div>
            <div>
            <button onClick={onLoginClick}>Login</button>
            <button onClick={onSignUpClick} style={{ marginLeft: '10px',  marginRight: '10px'}}>Sign Up</button>
            </div>
        </nav>
    </header>
  );
};

export default Header;
