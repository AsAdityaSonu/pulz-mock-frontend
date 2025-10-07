import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface RegisterData {
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  password: string;
  is_private?: boolean;
  interests: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credential: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credential: string, password: string): Promise<boolean> => {
    try {
      const data = await apiService.login(credential, password);
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const data = await apiService.register(userData);
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
