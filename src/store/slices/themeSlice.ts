// store/slices/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { themes } from '@/styles/themes';

type ThemeName = 'default' | 'ocean' | 'forest';
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  currentTheme: ThemeName;
  mode: ThemeMode;
}

type ThemePalette = Record<string, string>;
type ThemeCollection = Record<ThemeName, Partial<Record<ThemeMode, ThemePalette>>>;

const initialState: ThemeState = {
  currentTheme: (localStorage.getItem('theme') as ThemeName) || 'default',
  mode: (localStorage.getItem('themeMode') as ThemeMode) || 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
      localStorage.setItem('theme', action.payload);
      // Actualiza CSS variables (ver más abajo)
      applyThemeToDom(action.payload, state.mode);
    },
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
      applyThemeToDom(state.currentTheme, action.payload);
    },
  },
});

// Helper para aplicar tema al DOM
function applyThemeToDom(theme: ThemeName, mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'default');
  
  // Si tienes múltiples temas, también:
  root.setAttribute('data-palette', theme);
  
  // Actualizar CSS variables
  const typedThemes = themes as ThemeCollection;
  const palette = typedThemes[theme]?.[mode] ?? typedThemes.default.light ?? {};
  Object.entries(palette).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
}

export const { setTheme, setMode } = themeSlice.actions;
export default themeSlice.reducer;