'use client';

export class StorageService {
  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Save token with cookie for middleware
  public saveToken(token: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('auth_token', token);
        // Set cookie for middleware with 7 days expiry
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        console.log('Token saved to localStorage and cookie');
      } catch (error) {
        console.error('Error saving token:', error);
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

  // Save first name
  public saveFirstName(firstName: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem('first_name', firstName);
      } catch (error) {
        console.error('Error saving first name in local storage:', error);
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

  // Get token from cookie (for debugging)
  public getTokenFromCookie(): string | null {
    if (!this.isBrowser()) return null;
    
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return value;
      }
    }
    return null;
  }

  // Get first name
  public getFirstName(): string | null {
    return this.isBrowser() ? localStorage.getItem('first_name') : null;
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
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      localStorage.removeItem('first_name');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('session');
      localStorage.removeItem('user_session');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userData');
      localStorage.removeItem('profile');
      localStorage.removeItem('permissions');
      
      // Clear cookie - set with multiple path variations to ensure it's removed
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      document.cookie = 'token=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      
      console.log('All auth data cleared from localStorage and cookies');
    }
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if cookie exists (for debugging)
  public hasAuthCookie(): boolean {
    return !!this.getTokenFromCookie();
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
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  }
}

export const storageService = new StorageService();


export const storage = {
  // Auth functions
  saveToken: (token: string) => storageService.saveToken(token),
  getToken: () => storageService.getToken(),
  getTokenFromCookie: () => storageService.getTokenFromCookie(),
  saveUser: (user: any) => storageService.saveUser(user),
  getUser: () => storageService.getUser(),
  clearAuth: () => storageService.clearAuth(),
  isLoggedIn: () => storageService.isLoggedIn(),
  hasAuthCookie: () => storageService.hasAuthCookie(),
  
  // User data functions
  saveUserId: (userId: string) => storageService.saveUserId(userId),
  getUserId: () => storageService.getUserId(),
  saveRole: (role: string) => storageService.saveRole(role),
  getRole: () => storageService.getRole(),
  saveFirstName: (firstName: string) => storageService.saveFirstName(firstName),
  getFirstName: () => storageService.getFirstName(),
  
  // Generic functions
  saveItem: (key: string, value: string) => storageService.saveItem(key, value),
  getItem: (key: string) => storageService.getItem(key),
  removeItem: (key: string) => storageService.removeItem(key),
  clearAll: () => storageService.clearAll(),
};