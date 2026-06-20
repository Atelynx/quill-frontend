/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useLoginMutation,
  useRegisterMutation,
} from '../../../shared/api/hooks';
import type {
  LoginInput,
  RegisterResponse,
  RegisterInput,
  UserProfile,
} from '../../../shared/api/validators';
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
  UNAUTHORIZED_EVENT,
  updateAuthUser,
} from '../../../shared/api/auth-session';
import type { AuthSession } from '../../../shared/api/auth-session';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<RegisterResponse>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthSession | null>(() => getAuthSession());
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
      setAuthState(null);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [queryClient]);

  const startSession = (session: Parameters<typeof setAuthSession>[0]) => {
    queryClient.clear();
    setAuthState(setAuthSession(session));
  };

  const login = async (input: LoginInput) => {
    const response = await loginMutation.mutateAsync(input);
    startSession(response);
  };

  const register = async (input: RegisterInput) => {
    return await registerMutation.mutateAsync(input);
  };

  const logout = () => {
    queryClient.clear();
    clearAuthSession();
    setAuthState(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setAuthState(updateAuthUser(updates));
  };

  const value: AuthContextValue = {
    user: authState?.user ?? null,
    token: authState?.token ?? null,
    isAuthenticated: Boolean(authState?.token),
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return context;
}
