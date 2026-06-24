import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('sh02_auth_token');
        const storedUser = localStorage.getItem('sh02_auth_user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to parse stored auth session:', err);
        localStorage.removeItem('sh02_auth_token');
        localStorage.removeItem('sh02_auth_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to axios global logout trigger (e.g. on 401 response)
    const handleGlobalLogout = () => {
      setUser(null);
      localStorage.removeItem('sh02_auth_token');
      localStorage.removeItem('sh02_auth_user');
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('auth-logout', handleGlobalLogout);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('sh02_auth_token', data.token);
      localStorage.setItem('sh02_auth_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('API logout error (clearing credentials anyway):', err);
    } finally {
      localStorage.removeItem('sh02_auth_token');
      localStorage.removeItem('sh02_auth_user');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
