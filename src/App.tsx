// import { useState } from 'react'
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Navigate, useRoutes } from 'react-router-dom'
import Home from './app/Home'
import TestPage from './app/TestPage';

function RouterHandler() {
  return useRoutes([
    { path: '/home', element: <Home /> },
    { path: '/test', element: <TestPage /> },
    { path: '/', element: <Navigate to="/home" replace /> },
  ]);
}

function App() {
  const { currentTheme } = useAppSelector((state) => state.theme);
  const { dyslexicFont, readingGuide, highContrast, largeText } = useAppSelector(
    (state) => state.accessibility
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', currentTheme);
    root.setAttribute('data-font', dyslexicFont ? 'dyslexic' : 'default');
    root.setAttribute('data-reading-guide', readingGuide.toString());
    root.setAttribute('data-high-contrast', highContrast.toString());
    root.classList.toggle('text-lg', largeText);
  }, [currentTheme, dyslexicFont, readingGuide, highContrast, largeText]);

  return <RouterHandler />;
}

export default App
