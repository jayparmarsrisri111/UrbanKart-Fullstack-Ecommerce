import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminProfile } from '../services/api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('urbankart_token'));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('urbankart_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await getAdminProfile();
          setAdmin(profile);
          localStorage.setItem('urbankart_admin', JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = (newToken: string, user: AdminUser) => {
    setToken(newToken);
    setAdmin(user);
    localStorage.setItem('urbankart_token', newToken);
    localStorage.setItem('urbankart_admin', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('urbankart_token');
    localStorage.removeItem('urbankart_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
