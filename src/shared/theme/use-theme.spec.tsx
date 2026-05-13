import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ThemeToggle } from '../components/ThemeToggle';

describe('ThemeProvider', () => {
  it('cambia entre tema claro y oscuro y lo persiste', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(
      screen.getByRole('button', { name: /Tema actual: .* Cambiar tema\./ }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Tema actual: .* Cambiar tema\./ }),
    );

    expect(localStorage.getItem('theme')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Tema actual: .* Cambiar tema\./ }),
    ).toBeInTheDocument();
  });
});
