import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await authService.getProfile();
      console.log('Fetch profile response:', response);
      setUser(response);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      console.log('AuthContext login response:', response);
      const { user: userData, token: authToken } = response;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('AuthContext login error:', error);
      const message = error.message || error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      console.log('AuthContext register response:', response);
      const { user: newUser, token: authToken } = response;
      
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      console.error('AuthContext register error:', error);
      const message = error.message || error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    authService.logout();
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
