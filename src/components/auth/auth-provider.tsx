'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getSessionFromCookie } from '@/services/platform/auth';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { logoutAction, refreshSessionAction } from '@/app/(auth)/actions';

export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    emailConfirmed: boolean;
    provider?: string | null;
    isNewUser?: boolean;
  } | null;
  expiresIn: number | null;
};

type AuthContextType = {
  session: Session | null;
  client: VeyraPlatformClient | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  login: (accessToken: string, refreshToken: string, user: Session['user'], expiresIn: number) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionRef = useRef<Session | null>(null);
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  const updateSession = useCallback((nextSession: Session | null) => {
    sessionRef.current = nextSession;
    setSessionState(nextSession);
  }, []);

  useEffect(() => {
    const s = getSessionFromCookie();
    updateSession(s);
    setIsLoading(false);
  }, [updateSession]);

  const setSession = useCallback((s: Session | null) => {
    updateSession(s);
  }, [updateSession]);

  const login = useCallback(
    (accessToken: string, _refreshToken: string, user: Session['user'], expiresIn: number) => {
      updateSession({ accessToken, refreshToken: null, user, expiresIn });
    },
    [updateSession],
  );

  const logout = useCallback(() => {
    updateSession(null);
    void logoutAction().catch(() => {
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
    });
  }, [updateSession]);

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      const refreshed = await refreshSessionAction();
      if (!refreshed.ok) {
        updateSession(null);
        return false;
      }

      updateSession({
        accessToken: refreshed.accessToken,
        refreshToken: null,
        user: refreshed.user,
        expiresIn: refreshed.expiresIn,
      });
      return true;
    })();

    refreshPromiseRef.current = refreshPromise;
    try {
      return await refreshPromise;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, [updateSession]);

  const client = useMemo(
    () =>
      new VeyraPlatformClient({
        baseUrl: apiBaseUrl,
        getToken: () => sessionRef.current?.accessToken ?? null,
        onTokenExpired: refreshSession,
        onUnauthenticated: logout,
      }),
    [logout, refreshSession],
  );

  return (
    <AuthContext.Provider value={{ session, client, isLoading, setSession, login, logout, refreshSession: async () => { await refreshSession(); } }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
