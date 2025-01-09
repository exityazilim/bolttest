import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { setLogoutHandler } from '../utils/errorHandling';

interface User {
  name: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  roles: any[] | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  loginError: string | null;
  setLoginError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRoles(null);
    navigate('/login');
  };

  useEffect(() => {
    setLogoutHandler(logout);

    const initAuth = async () => {
      const sessionKey = localStorage.getItem('sessionKey');
      if (!sessionKey) {
        setIsLoading(false);
        return;
      }

      try {
        const cachedUser = localStorage.getItem('me');
        const cachedRoles = localStorage.getItem('roles');
        
        if (cachedUser && cachedRoles) {
          setUser(JSON.parse(cachedUser));
          setRoles(JSON.parse(cachedRoles));
        }

        const [userData, rolesData] = await Promise.all([
          api.getMe(),
          api.getRoles(),
        ]);
        
        localStorage.setItem('me', JSON.stringify(userData));
        localStorage.setItem('roles', JSON.stringify(rolesData));
        
        setUser(userData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Auth refresh failed:', error);
        if (error instanceof Error) {
          setLoginError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (username: string, password: string) => {
    setLoginError(null);
    try {
      const sessionKey = await api.login(username, password);
      localStorage.setItem('sessionKey', sessionKey);
      
      const [userData, rolesData] = await Promise.all([
        api.getMe(),
        api.getRoles(),
      ]);
      
      localStorage.setItem('me', JSON.stringify(userData));
      localStorage.setItem('roles', JSON.stringify(rolesData));
      
      setUser(userData);
      setRoles(rolesData);
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      roles, 
      login, 
      logout, 
      isLoading,
      loginError,
      setLoginError 
    }}>
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