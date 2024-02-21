import React from 'react';
import { Link } from 'react-router-dom';

const NewPage: React.FC = () => {
    return (
        <div>
            <h1>
            <Link to="/">Home</Link>
            </h1>
        </div>
    );
};
 
export default NewPage;
