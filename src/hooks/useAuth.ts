import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const AUTH_STORAGE_KEY = 'fortigate_auth';

/**
 * Authentication hook
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(authStatus === 'true');
  }, []);

  /**
   * Login user with credentials
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.login(username, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}