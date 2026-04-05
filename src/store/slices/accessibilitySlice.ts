// store/slices/accessibilitySlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AccessibilityState {
  dyslexicFont: boolean;
  readingGuide: boolean;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

const initialState: AccessibilityState = {
  dyslexicFont: localStorage.getItem('a11y-dyslexic') === 'true',
  readingGuide: localStorage.getItem('a11y-reading-guide') === 'true',
  highContrast: localStorage.getItem('a11y-high-contrast') === 'true',
  largeText: localStorage.getItem('a11y-large-text') === 'true',
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    toggleDyslexicFont: (state) => {
      state.dyslexicFont = !state.dyslexicFont;
      localStorage.setItem('a11y-dyslexic', state.dyslexicFont.toString());
      applyA11yToDom(state);
    },
    toggleReadingGuide: (state) => {
      state.readingGuide = !state.readingGuide;
      localStorage.setItem('a11y-reading-guide', state.readingGuide.toString());
      applyA11yToDom(state);
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
      localStorage.setItem('a11y-high-contrast', state.highContrast.toString());
      applyA11yToDom(state);
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
      localStorage.setItem('a11y-large-text', state.largeText.toString());
      applyA11yToDom(state);
    },
  },
});

function applyA11yToDom(state: AccessibilityState) {
  const root = document.documentElement;
  root.setAttribute('data-font', state.dyslexicFont ? 'dyslexic' : 'default');
  root.setAttribute('data-reading-guide', state.readingGuide.toString());
  root.setAttribute('data-high-contrast', state.highContrast.toString());
  root.classList.toggle('text-lg', state.largeText);
}

export const { toggleDyslexicFont, toggleReadingGuide, toggleHighContrast, toggleLargeText } = accessibilitySlice.actions;
export default accessibilitySlice.reducer;