'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login as loginService, me as meService, logout as logoutService } from '@/services/auth';

interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar o usuário via /me
  const refreshUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await meService();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user session:', error);
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password });
    Cookies.set('token', response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
