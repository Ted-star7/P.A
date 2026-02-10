'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { postRequest } from '@/services/api';
import { storage } from '@/lib/storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'SUPERADMIN';
}

interface LoginApiResponse {
  message: string;
  data: {
    firstName: string;
    token: string;
    role: 'ADMIN' | 'SUPER_ADMIN' | 'SUPERADMIN';
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and token from storage on mount
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedToken = storage.getToken();
        const storedUser = storage.getUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const response: LoginApiResponse = await postRequest('/open/auth/login', {
        email,
        password,
      });

      console.log('Login API response:', response);

      if (response.data?.token && response.data?.firstName) {
        const { token: apiToken, firstName, role } = response.data;
        
        // Extract user ID from the JWT token (if possible)
        // Or generate a temporary ID from email
        const userId = email; // Using email as ID since API doesn't provide ID
        
        // Normalize role (convert SUPERADMIN to SUPER_ADMIN if needed)
        const normalizedRole = role === 'SUPERADMIN' ? 'SUPER_ADMIN' : role;
        
        // Create user object
        const normalizedUser: User = {
          id: userId,
          email: email,
          firstName: firstName,
          role: normalizedRole,
        };
        
        console.log('Normalized user data:', normalizedUser);
        
        // First, clear any existing auth data
        clearAllAuthData();
        
        // Save to storage
        storage.saveToken(apiToken);
        storage.saveUser(normalizedUser);
        storage.saveUserId(userId);
        storage.saveRole(normalizedRole);
        storage.saveFirstName(firstName);
        
        // Update state
        setToken(apiToken);
        setUser(normalizedUser);
        
        console.log('Login successful. Token saved, user data stored.');
        
        // Check what's in localStorage
        console.log('LocalStorage after login:', {
          token: apiToken.substring(0, 20) + '...',
          firstName: storage.getFirstName(),
          role: storage.getRole(),
          user: storage.getUser()
        });
        
      } else {
        console.error('Missing token or firstName in response:', response);
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Clear any partial auth data on failure
      clearAllAuthData();
      setUser(null);
      setToken(null);
      
      // Re-throw the error for the LoginPage to display
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to clear ALL auth-related localStorage items
  const clearAllAuthData = () => {
    console.log('Clearing all auth data from localStorage...');
    
    // Clear using storage service
    storage.clearAuth();
    
    // Clear leftover items from other apps/previous implementations
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('session');
      localStorage.removeItem('user_session');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userData');
      localStorage.removeItem('profile');
      localStorage.removeItem('permissions');
      
      // You can add more keys if you find other leftover items
    }
    
    console.log('All auth data cleared from localStorage');
  };

  const logout = () => {
    console.log('Logging out user...');
    
    // Clear ALL auth data from storage
    clearAllAuthData();
    
    // Clear React state
    setUser(null);
    setToken(null);
    
    // Force redirect to login page with full reload to clear any cached state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
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