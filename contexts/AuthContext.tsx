'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { postRequest } from '@/services/api';

interface User {
  id?: string;
  email: string;
  name: string;
  firstName?: string;
  secondName?: string;
  role?: string;
}

interface AuthResponse {
  message?: string;
  data?: {
    token?: string;
    user?: User;
  };
}

interface RegisterResponse {
  message?: string;
  data?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    secondName: string;
    email: string;
    role: string;
  }, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await postRequest('/open/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response);

      if (response.data?.token) {
        // Save token
        localStorage.setItem('auth_token', response.data.token);
        
        // Create user object
        const userData: User = response.data.user || {
          email,
          name: email.split('@')[0],
          role: 'USER'
        };
        
        // Save user
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed: No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    firstName: string;
    secondName: string;
    email: string;
    role: string;
  }, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration with data:', userData);
      
      // Register the user
      const registerResponse: RegisterResponse = await postRequest('/admin/auth/register', userData);
      
      console.log('Registration response:', registerResponse);
      
      if (registerResponse.message && 
          (registerResponse.message.toLowerCase().includes('success') || 
           registerResponse.message.toLowerCase().includes('created'))) {
        
        console.log('Registration successful, attempting auto-login...');
        
        // Auto login after successful registration
        await login(userData.email, password);
      } else {
        throw new Error(registerResponse.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Use window.location for full page reload to clear state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!localStorage.getItem('auth_token'),
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};