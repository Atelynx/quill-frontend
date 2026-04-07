import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { AppRouter } from './app/router/AppRouter';
import './app/main-page-forms.css';
import './app/main-page-primitives.css';

function App() {
  const { currentTheme } = useAppSelector((state) => state.theme);
  const { dyslexicFont, readingGuide, highContrast, largeText } = useAppSelector(
    (state) => state.accessibility,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', currentTheme);
    root.setAttribute('data-font', dyslexicFont ? 'dyslexic' : 'default');
    root.setAttribute('data-reading-guide', readingGuide.toString());
    root.setAttribute('data-high-contrast', highContrast.toString());
    root.classList.toggle('text-lg', largeText);
  }, [currentTheme, dyslexicFont, readingGuide, highContrast, largeText]);

  return <AppRouter />;
}

export default App;

