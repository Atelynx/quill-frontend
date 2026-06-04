/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import {
  useLoginMutation,
  useRegisterMutation,
} from '../../../shared/api/hooks';
import type {
  AuthResponse,
  LoginInput,
  RegisterResponse,
  RegisterInput,
  UserProfile,
} from '../../../shared/api/validators';

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
  const raw = sessionStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthState;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<StoredAuthState | null>(() => readStoredState());
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const persistSession = (session: AuthResponse) => {
    const nextState = {
      token: session.accessToken,
      user: session.user,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setAuthState(nextState);
  };

  const login = async (input: LoginInput) => {
    const response = await loginMutation.mutateAsync(input);
    persistSession(response);
  };

  const register = async (input: RegisterInput) => {
    return await registerMutation.mutateAsync(input);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
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
