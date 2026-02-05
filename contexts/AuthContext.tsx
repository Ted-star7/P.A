'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { storage } from '@/lib/storage';

// User interface based on your API response
export interface User {
  id?: string;
  email: string;
  name: string;
  role?: string;
  firstName?: string;
  secondName?: string;
}

// API Response interfaces
interface LoginResponseData {
  message: string;
  data: {
    token: string;
    user?: User;
  };
}

interface RegisterResponseData {
  message: string;
  data: string; // Just a string message according to your API
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      const savedUser = storage.getUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<LoginResponseData>('/api/open/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        const loginData = response.data;
        
        if (loginData.data && loginData.data.token) {
          const { token, user: userData } = loginData.data;
          
          // Store token using storage service
          storage.saveToken(token);
          
          // Prepare user object
          let userObj: User;
          if (userData) {
            userObj = userData;
          } else {
            // Create basic user object if not provided
            userObj = {
              email,
              name: email.split('@')[0],
              role: 'USER'
            };
          }
          
          // Store user data
          storage.saveUser(userObj);
          setUser(userObj);
        } else {
          throw new Error(loginData.message || 'Invalid response from server');
        }
      } else {
        throw new Error(response.message || response.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Split name into firstName and secondName
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const secondName = nameParts.slice(1).join(' ') || firstName; // Use firstName as fallback

      // Call the signup API
      const signupResponse = await api.post<RegisterResponseData>('/api/open/auth/register', {
        email,
        firstName,
        secondName,
        role: 'ADMIN',
      });

      if (signupResponse.success && signupResponse.data) {
        const registerData = signupResponse.data;
        
        // Check if registration was successful
        if (registerData.message && registerData.message.toLowerCase().includes('success')) {
          // After successful signup, automatically login
          await login(email, password);
        } else {
          throw new Error(registerData.message || 'Signup failed');
        }
      } else {
        throw new Error(signupResponse.message || signupResponse.error || 'Signup failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storage.clearAuth();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // You'll need to implement this based on your API
      // For now, it's a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Password reset requested for: ${email}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && storage.isLoggedIn(),
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
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