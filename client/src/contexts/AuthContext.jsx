import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem('eduflow_token');

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        if (isMounted) setUser(response.data.data.user);
      } catch {
        localStorage.removeItem('eduflow_token');
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user: loggedInUser } = response.data.data;
    localStorage.setItem('eduflow_token', token);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(name, email, password, role) {
    const response = await api.post('/api/auth/register', { name, email, password, role });
    const { token, user: registeredUser } = response.data.data;
    localStorage.setItem('eduflow_token', token);
    setUser(registeredUser);
    return registeredUser;
  }

  function logout() {
    localStorage.removeItem('eduflow_token');
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
