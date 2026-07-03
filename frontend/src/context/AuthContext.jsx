import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children, showToast }) => {
  const [token, setToken] = useState(localStorage.getItem('careos_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('careos_token');
    setToken(null);
    setUser(null);
    if (showToast) showToast('Signed out successfully.', 'info');
  }, [showToast]);

  const checkSession = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
    } catch (err) {
      console.error('Session verification failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    setIsSubmitting(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('careos_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (showToast) showToast(`Welcome back, ${data.user.name}!`, 'success');
      return data.user;
    } catch (err) {
      if (showToast) showToast(err || 'Invalid credentials.', 'error');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (name, email, password, role, phone, location) => {
    setIsSubmitting(true);
    try {
      const data = await api.post('/auth/signup', { name, email, password, role, phone, location });
      localStorage.setItem('careos_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (showToast) showToast('Welcome! Account registered successfully.', 'success');
      return data.user;
    } catch (err) {
      if (showToast) showToast(err || 'Registration failed.', 'error');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, user, loading, login, register, logout, isSubmitting
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
