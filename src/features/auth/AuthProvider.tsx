import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { authApi } from '../../api/endpoints/auth';
import { getOrCreateDeviceId } from '../../lib/device';
import { subscribeToUnauthorized } from '../../lib/auth-events';
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '../../lib/storage';
import type {
  AuthTokenData,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginRequest) => Promise<User>;
  register: (payload: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  setSession: (session: AuthTokenData) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(session: AuthTokenData): void {
  setStoredToken(session.token);
  setStoredUser(session.user);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  const clearSession = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const setSession = (session: AuthTokenData) => {
    setToken(session.token);
    setUser(session.user);
    persistSession(session);
  };

  useEffect(() => {
    getOrCreateDeviceId();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToUnauthorized(() => {
      clearSession();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const nextUser = await authApi.me();

        if (isMounted) {
          setUser(nextUser);
          setStoredUser(nextUser);
        }
      } catch (error: any) {
        if (isMounted && (error?.status === 401 || error?.status === 403)) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      async login(payload) {
        const session = await authApi.login(payload);
        setSession(session);
        return session.user;
      },
      async register(payload) {
        const session = await authApi.register(payload);
        setSession(session);
        return session.user;
      },
      async logout() {
        try {
          if (token) {
            await authApi.logout();
          }
        } finally {
          clearSession();
        }
      },
      setSession,
    }),
    [isInitializing, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
