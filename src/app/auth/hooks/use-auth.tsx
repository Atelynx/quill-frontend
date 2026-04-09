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
const ENABLE_STUB_AUTH =
  String(import.meta.env.VITE_USE_STUBS ?? import.meta.env.USE_STUBS ?? 'false').toLowerCase() ===
  'true';
const STUB_EMAIL = String(import.meta.env.VITE_STUB_EMAIL ?? 'demo@quill.cl').trim().toLowerCase();
const STUB_PASSWORD = String(import.meta.env.VITE_STUB_PASSWORD ?? 'qwerty123');
const STUB_FULL_NAME = 'Demo Quill';
const STUB_USER_ID = 'stub-user-1';
const STUB_AVAILABLE_BALANCE = 2000000;

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

function createStubSession(): AuthResponse {
  return {
    accessToken: `stub-token-${Date.now()}`,
    user: {
      id: STUB_USER_ID,
      fullName: STUB_FULL_NAME,
      email: STUB_EMAIL,
      availableBalance: Number.isFinite(STUB_AVAILABLE_BALANCE) ? STUB_AVAILABLE_BALANCE : 2000000,
      reservedBalance: 0,
    },
  };
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
    if (ENABLE_STUB_AUTH) {
      const isStubEmail = input.email.trim().toLowerCase() === STUB_EMAIL;
      const isStubPassword = input.password === STUB_PASSWORD;

      if (!isStubEmail || !isStubPassword) {
        throw new Error(
          `Credenciales de prueba invalidas. Usa ${STUB_EMAIL} / ${STUB_PASSWORD}.`,
        );
      }

      persistSession(createStubSession());
      return;
    }

    const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
    persistSession(data);
  };

  const register = async (input: RegisterInput) => {
    if (ENABLE_STUB_AUTH) {
      return {
        message: 'Cuenta de prueba creada. Ahora puedes iniciar sesion.',
        email: input.email,
      };
    }

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
