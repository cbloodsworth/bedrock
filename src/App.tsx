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

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Resumes" element={<Resumes />} />
      </Routes>
    </Router>
  )
}

export default App
