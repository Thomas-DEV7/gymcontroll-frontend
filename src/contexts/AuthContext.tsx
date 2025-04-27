'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login as loginService, me as meService, logout as logoutService } from '@/services/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await meService();
          setUser(response.data);
        } catch (error) {
          Cookies.remove('token');
        }
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password });
    Cookies.set('token', response.data.token);
    const userResponse = await meService();
    setUser(userResponse.data);
  };

  const logout = async () => {
    await logoutService();
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
