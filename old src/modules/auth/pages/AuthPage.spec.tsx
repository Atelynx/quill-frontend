import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { AuthPage } from './AuthPage';

const { loginMock, registerMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
}));

vi.mock('../hooks/use-auth', () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

function getInputByName(name: string) {
  const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);

  if (!input) {
    throw new Error(`No se encontro el input ${name}.`);
  }

  return input;
}

describe('AuthPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    registerMock.mockReset();
  });

  it('valida el formulario de login antes de enviarlo', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AuthPage />);

    await user.type(screen.getByLabelText('Correo'), 'ana@quill.dev');
    await user.type(getInputByName('password'), '123');
    await user.click(screen.getByRole('button', { name: 'Entrar a Quill' }));

    expect(
      await screen.findByText(
        'La contrasena debe tener al menos 8 caracteres.',
      ),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('valida que la confirmacion de contrasena coincida en registro', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AuthPage />);

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Lopez');
    await user.type(screen.getByLabelText('Correo'), 'ana@quill.dev');
    await user.type(getInputByName('password'), 'Password123');
    await user.type(
      getInputByName('confirmPassword'),
      'Password124',
    );
    await user.click(screen.getAllByRole('button', { name: 'Crear cuenta' })[1]);

    expect(
      await screen.findByText('Las contrasenas deben coincidir.'),
    ).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('permite mostrar y ocultar las contrasenas del formulario', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AuthPage />);

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    const passwordInput = getInputByName('password');
    const confirmPasswordInput = getInputByName('confirmPassword');
    const toggleButtons = screen.getAllByRole('button', {
      name: 'Mostrar contrasena',
    });

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButtons[0]);
    await user.click(toggleButtons[1]);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
});
