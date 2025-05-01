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

  const saveUserToStorage = (user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  const loadUserFromStorage = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem('user');
      }
    }
  };

  const refreshUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setUser(null);
      saveUserToStorage(null);
      Cookies.remove('name');
      return;
    }

    try {
      const response = await meService();
      const userData = response.data;
      setUser(userData);
      saveUserToStorage(userData);
      Cookies.set('name', userData.name); // opcional: salvar nome no cookie
    } catch (error) {
      console.error('Erro ao atualizar sessão', error);
      Cookies.remove('token');
      Cookies.remove('name');
      setUser(null);
      saveUserToStorage(null);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    loadUserFromStorage();
    refreshUser();
  }, []);


  useEffect(() => {
    const loadAndRefreshUser = async () => {
      // Primeiro, tenta carregar do localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('user');
        }
      }

      // Agora tenta validar com o backend
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await meService();
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.warn('Falha ao validar sessão com /me');
          // Não apaga o user local se /me falhar
        }
      }

      setLoading(false);
    };

    loadAndRefreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password });
    Cookies.set('token', response.token);
    setUser(response.user);
    saveUserToStorage(response.user);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.warn('Logout failed, clearing session anyway.');
    }
    Cookies.remove('token');
    setUser(null);
    saveUserToStorage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
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
