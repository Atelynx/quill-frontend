import { useTheme } from '../theme/use-theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === 'light' ? 'oscuro' : 'claro';

  return (
    <button
      aria-label={`Cambiar a modo ${nextThemeLabel}`}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24">
            <path d="M12 3.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm0 14a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0 3a1 1 0 0 1 1 1V23a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.9 5.9a1 1 0 0 1 1.4 0L7.4 7a1 1 0 0 1-1.4 1.4L4.9 7.3a1 1 0 0 1 0-1.4Zm11.7 11.7a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 1 1-1.4 1.4l-1.1-1.1a1 1 0 0 1 0-1.4ZM3.5 12a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H4.5a1 1 0 0 1-1-1Zm14.5 0a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H19a1 1 0 0 1-1-1ZM6 16.6A1 1 0 0 1 7.4 18l-1.1 1.1a1 1 0 0 1-1.4-1.4L6 16.6Zm12.1-11.7a1 1 0 0 1 0 1.4L17 7.4A1 1 0 1 1 15.6 6l1.1-1.1a1 1 0 0 1 1.4 0Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M14.7 3.2a1 1 0 0 1 .9 1.6 7.7 7.7 0 1 0 3.6 10.5 1 1 0 0 1 1.8.8A9.7 9.7 0 1 1 13.9 3.3a1 1 0 0 1 .8-.1Z" />
          </svg>
        )}
      </span>
      <span>{theme === 'light' ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}
