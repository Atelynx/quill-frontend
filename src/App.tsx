// import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
// import NotFound from './pages/NotFound'
import Home from './pages/Home'
import TestPage from './pages/TestPage';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App
