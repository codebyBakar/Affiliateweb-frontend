import { createContext, useContext, useState, useEffect } from 'react';
import { api, setCachedToken } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bellezza_token');
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => { localStorage.removeItem('bellezza_token'); setCachedToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('bellezza_token', data.token);
    setCachedToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('bellezza_token');
    setCachedToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
