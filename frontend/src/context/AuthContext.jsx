import { createContext, useContext, useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
        }
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 