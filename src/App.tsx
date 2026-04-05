// import { useState } from 'react'
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import TestPage from './pages/TestPage';

function App() {
  const { currentTheme, mode } = useAppSelector((state) => state.theme);
  const { dyslexicFont, readingGuide, highContrast, largeText } = useAppSelector(
    (state) => state.accessibility
  );

  useEffect(() => {
    // Aplicar tema al cargar
    const root = document.documentElement;
    root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'default');
    root.setAttribute('data-palette', currentTheme);
    root.setAttribute('data-font', dyslexicFont ? 'dyslexic' : 'default');
    root.setAttribute('data-reading-guide', readingGuide.toString());
    root.setAttribute('data-high-contrast', highContrast.toString());
    root.classList.toggle('text-lg', largeText);
  }, [currentTheme, mode, dyslexicFont, readingGuide, highContrast, largeText]);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App
