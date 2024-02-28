import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';


import './App.css'
import Resumes from './pages/Resumes'
import Homepage from './pages/Homepage'
import Login from './pages/Login';
import ResumesFolder from './pages/ResumesFolder';

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/ResumesFolder/Resume" element={<Resumes />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ResumesFolder" element={<ResumesFolder />} />
      </Routes>
    </Router>
  )
}

export default App
