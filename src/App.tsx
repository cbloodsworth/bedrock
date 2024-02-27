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

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Resumes" element={<Resumes />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
