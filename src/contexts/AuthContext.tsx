'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name: string) => Promise<User | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const current = await authService.getCurrentUser();
    setUser(current);
  };

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (email: string, password: string, name: string) => {
    const u = await authService.register(email, password, name);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
