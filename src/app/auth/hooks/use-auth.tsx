/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { apiClient } from '../../../shared/api/http';
import type {
  AuthResponse,
  LoginInput,
  RegisterResponse,
  RegisterInput,
  UserProfile,
} from '../../../shared/api/types';

const STORAGE_KEY = 'quill_auth';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<RegisterResponse>;
  logout: () => void;
}

interface StoredAuthState {
  token: string;
  user: UserProfile;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredState(): StoredAuthState | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<StoredAuthState | null>(() => readStoredState());

  const persistSession = (session: AuthResponse) => {
    const nextState = {
      token: session.accessToken,
      user: session.user,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setAuthState(nextState);
  };

  const login = async (input: LoginInput) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
    persistSession(data);
  };

  const register = async (input: RegisterInput) => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', input);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState(null);
  };

  const value: AuthContextValue = {
    user: authState?.user ?? null,
    token: authState?.token ?? null,
    isAuthenticated: Boolean(authState?.token),
    login,
    register,
    logout,
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
