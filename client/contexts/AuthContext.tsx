'use client';

import axios from '@/lib/axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('AuthContext - storedUser:', storedUser);
    console.log('AuthContext - token:', token);
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext - parsedUser:', parsedUser);
        
        // Ensure the user object has all required properties
        if (parsedUser && parsedUser.id && parsedUser.username && parsedUser.email) {
          console.log('AuthContext - setting user:', parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.error('AuthContext - Invalid user data in localStorage:', parsedUser);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('AuthContext - Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (!response.data) {
        throw new Error('Login failed');
      }

      const data = response.data;
      console.log('AuthContext - Login response:', data);
      
      // Extract the user ID from the JWT token
      const token = data.token;
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.nameid;
      
      console.log('AuthContext - User ID from token:', userId);
      
      // Ensure we have all required user data
      if (!userId || !data.username || !data.email) {
        console.error('AuthContext - Missing required user data:', { userId, username: data.username, email: data.email });
        throw new Error('Invalid user data received from server');
      }
      
      const userData = { 
        id: userId,
        username: data.username, 
        email: data.email 
      };
      
      console.log('AuthContext - Setting user data:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });

      if (!response.data) {
        throw new Error('Registration failed');
      }

      // Don't automatically log in after registration
      // Just return success
      return;
    } catch (error) {
      console.error('AuthContext - Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 