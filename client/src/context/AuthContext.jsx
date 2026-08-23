import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('mera-store-user')) || null; } catch { return null; } });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('mera-store-token')));

  useEffect(() => {
    if (!localStorage.getItem('mera-store-token')) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => { localStorage.removeItem('mera-store-token'); localStorage.removeItem('mera-store-user'); setUser(null); }).finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => { localStorage.setItem('mera-store-token', data.token); localStorage.setItem('mera-store-user', JSON.stringify(data.user)); setUser(data.user); };
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); saveSession(data); return data.user; };
  const register = async (credentials) => { const { data } = await api.post('/auth/register', credentials); saveSession(data); return data.user; };
  const logout = () => { localStorage.removeItem('mera-store-token'); localStorage.removeItem('mera-store-user'); setUser(null); };
  const updateProfile = async (payload) => { const { data } = await api.put('/auth/profile', payload); localStorage.setItem('mera-store-user', JSON.stringify(data.user)); setUser(data.user); return data.user; };

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
