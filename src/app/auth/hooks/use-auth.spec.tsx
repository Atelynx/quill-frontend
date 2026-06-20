import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAuthSession,
  setAuthSession,
} from '../../../shared/api/auth-session';
import { AuthProvider, useAuth } from './use-auth';

const { loginMock, registerMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
}));

const authResponse = {
  accessToken: 'nuevo-token',
  user: {
    id: 'user-2',
    fullName: 'Nuevo Usuario',
    email: 'nuevo@quill.cl',
    role: 'investor' as const,
    watchlist: [],
    availableBalance: 1000,
    reservedBalance: 0,
  },
};

vi.mock('../../../shared/api/hooks', () => ({
  useLoginMutation: () => ({ mutateAsync: loginMock }),
  useRegisterMutation: () => ({ mutateAsync: registerMock }),
}));

function AuthCacheProbe() {
  const { isAuthenticated, login, logout } = useAuth();
  const queryClient = useQueryClient();

  return (
    <>
      <button type="button" onClick={() => logout()}>
        Cerrar sesión
      </button>
      <button
        type="button"
        onClick={() => {
          void login({ email: 'nuevo@quill.cl', password: 'Password123' });
        }}
      >
        Iniciar sesión
      </button>
      <span>Cache: {String(queryClient.getQueryData(['profile']))}</span>
      <span>Autenticado: {String(isAuthenticated)}</span>
    </>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    clearAuthSession();
    sessionStorage.clear();
    loginMock.mockReset();
    registerMock.mockReset();
  });

  it('limpia completamente la cache al cerrar sesion', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['profile'], 'usuario-anterior');
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthCacheProbe />
        </AuthProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Cache:/)).toHaveTextContent('usuario-anterior');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    });

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(screen.getByText('Autenticado: false')).toBeInTheDocument();
  });

  it('limpia estado y cache al recibir una autorizacion fallida', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['profile'], 'usuario-anterior');
    setAuthSession(authResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthCacheProbe />
        </AuthProvider>
      </QueryClientProvider>,
    );

    act(() => {
      clearAuthSession();
    });

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(screen.getByText('Autenticado: false')).toBeInTheDocument();
  });

  it('no restaura una sesion persistida al montar tras una recarga', () => {
    sessionStorage.setItem('quill_auth', JSON.stringify(authResponse));

    render(
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <AuthCacheProbe />
        </AuthProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Autenticado: false')).toBeInTheDocument();
    expect(sessionStorage).toHaveLength(0);
  });

  it('limpia la cache antes de persistir una nueva sesion', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['profile'], 'usuario-anterior');
    loginMock.mockResolvedValue(authResponse);
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthCacheProbe />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    });

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(screen.getByText('Autenticado: true')).toBeInTheDocument();
    expect(sessionStorage).toHaveLength(0);
  });
});
