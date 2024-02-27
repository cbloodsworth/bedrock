import React from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  const handleClick = (action: string) => {
    console.log(action);
  };

  return (

    <header style={{width:"100%"}}>
        <nav>
            <div>
                <Link className="link-item" to='/'><button className="navbarButton">Home</button></Link>
                <Link className="link-item" to='/ResumesFolder'><button className="navbarButton">Resumes</button></Link>
                <button className="navbarButton" onClick={() => handleClick("Button 3")}>Button 3</button> 
            </div>
            <div>
                <Link className="link-item" to='/Login'><button className="navbarButton">Login</button></Link>
            </div>
        </nav>
    </header>
  );
};

export default Navbar;
