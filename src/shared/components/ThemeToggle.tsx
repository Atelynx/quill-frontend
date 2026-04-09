import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/themeSlice';
import { resolveTheme, themes } from '@/styles/themes';
import type { ThemeName } from '@/styles/themes';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector((state) => state.theme);

  const cycleThemes = useMemo<ThemeName[]>(
    () =>
      (Object.keys(themes) as ThemeName[]).filter(
        (themeName) => themeName !== 'lightDefault' && themeName !== 'darkDefault',
      ),
    [],
  );

  const currentThemeDefinition = themes[currentTheme];
  const currentThemeMode = resolveTheme(currentTheme).mode;
  const accentColor = resolveTheme(currentTheme).palette.accent;

  const cycleTheme = () => {
    if (cycleThemes.length === 0) {
      return;
    }

    const currentIndex = cycleThemes.indexOf(currentTheme);

    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % cycleThemes.length;
      dispatch(setTheme(cycleThemes[nextIndex]));
      return;
    }

    const firstByCurrentMode = cycleThemes.find(
      (themeName) => themes[themeName].mode === currentThemeMode,
    );

    dispatch(setTheme(firstByCurrentMode ?? cycleThemes[0]));
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      type="button"
      aria-label={`Tema actual: ${currentThemeDefinition.label}. Cambiar tema.`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {currentThemeMode === 'light' ? (
          <svg className="h-6 w-6" viewBox="2 3 27 27" fill="currentColor" style={{ color: accentColor }}>
            <path d="M8.031 16.5c0 4.143 3.358 7.5 7.5 7.5s7.5-3.357 7.5-7.5-3.357-7.5-7.5-7.5c-4.142 0-7.5 3.357-7.5 7.5zM15.531 3.75l-2.109 4.219h4.219l-2.11-4.219zM24.543 7.457l-4.475 1.491 2.982 2.983 1.493-4.474zM10.994 8.948l-4.474-1.491 1.491 4.475 2.983-2.984zM6.969 14.359l-4.219 2.11 4.219 2.109v-4.219zM24.031 18.641l4.219-2.109-4.219-2.109v4.218zM15.531 29.25l2.109-4.219h-4.219l2.11 4.219zM20.068 24.052l4.475 1.491-1.492-4.475-2.983 2.984zM6.52 25.543l4.475-1.491-2.983-2.983-1.492 4.474z"/>
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="-1 -1 26 26" fill="currentColor" style={{ color: accentColor }}>
            <path d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z"/>
            <path d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z"/>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
          </svg>
        )}
      </span>
      <span>{currentThemeDefinition.label}</span>
    </button>
  );
}
