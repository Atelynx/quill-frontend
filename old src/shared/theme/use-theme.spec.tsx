import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from './use-theme';

describe('ThemeProvider', () => {
  it('cambia entre tema claro y oscuro y lo persiste', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Cambiar a modo oscuro' }),
    );

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('quill_theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Cambiar a modo claro' })).toBeInTheDocument();
  });
});
