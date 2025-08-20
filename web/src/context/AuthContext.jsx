import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/status');
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  const signIn = () => {
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 