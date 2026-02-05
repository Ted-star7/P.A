'use client';

// Local Storage Service for Next.js
export class StorageService {
  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Save token
  public saveToken(token: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('auth_token', token);
      } catch (error) {
        console.error('Error saving token in local storage:', error);
      }
    }
  }

  // Save user ID
  public saveUserId(userId: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('user_id', userId);
      } catch (error) {
        console.error('Error saving userId in local storage:', error);
      }
    }
  }

  // Save role
  public saveRole(role: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('user_role', role);
      } catch (error) {
        console.error('Error saving role in local storage:', error);
      }
    }
  }

  // Save username
  public saveUsername(username: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('username', username);
      } catch (error) {
        console.error('Error saving username in local storage:', error);
      }
    }
  }

  // Save user object (for storing all user data)
  public saveUser(user: any): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user in local storage:', error);
      }
    }
  }

  // Get token
  public getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('auth_token') : null;
  }

  // Get username
  public getUsername(): string | null {
    return this.isBrowser() ? localStorage.getItem('username') : null;
  }

  // Get user ID
  public getUserId(): string | null {
    return this.isBrowser() ? localStorage.getItem('user_id') : null;
  }

  // Get role
  public getRole(): string | null {
    return this.isBrowser() ? localStorage.getItem('user_role') : null;
  }

  // Get user object
  public getUser(): any | null {
    if (!this.isBrowser()) return null;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from local storage:', error);
        return null;
      }
    }
    return null;
  }

  // Clear all auth data
  public clearAuth(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
    }
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Save any generic data
  public saveItem(key: string, value: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error saving ${key} in local storage:`, error);
      }
    }
  }

  // Get any generic data
  public getItem(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  // Remove any generic data
  public removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  // Clear all local storage
  public clearAll(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }
}

// Create and export a singleton instance
export const storageService = new StorageService();

// Export individual functions for convenience
export const storage = {
  // Auth functions
  saveToken: (token: string) => storageService.saveToken(token),
  getToken: () => storageService.getToken(),
  saveUser: (user: any) => storageService.saveUser(user),
  getUser: () => storageService.getUser(),
  clearAuth: () => storageService.clearAuth(),
  isLoggedIn: () => storageService.isLoggedIn(),
  
  // User data functions
  saveUserId: (userId: string) => storageService.saveUserId(userId),
  getUserId: () => storageService.getUserId(),
  saveRole: (role: string) => storageService.saveRole(role),
  getRole: () => storageService.getRole(),
  saveUsername: (username: string) => storageService.saveUsername(username),
  getUsername: () => storageService.getUsername(),
  
  // Generic functions
  saveItem: (key: string, value: string) => storageService.saveItem(key, value),
  getItem: (key: string) => storageService.getItem(key),
  removeItem: (key: string) => storageService.removeItem(key),
  clearAll: () => storageService.clearAll(),
};