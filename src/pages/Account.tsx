import React from 'react';
import Box from '../components/Box'
import { Link } from 'react-router-dom';

const Account: React.FC = () => {
    return (
        <>
            <div>
                <h1>
                <Link to="/">Home</Link>
                </h1>
            </div>
            <div>
                <Box></Box><br/>
                <Box></Box><br/>
                <Box></Box><br/>
            </div>
        </>
    );
};
 
export default Account;
