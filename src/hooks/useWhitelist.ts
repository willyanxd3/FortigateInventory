import { useState, useEffect, useCallback } from 'react';
import { WhitelistItem } from '../types';
import { apiClient } from '../services/apiClient';

/**
 * Hook for managing whitelist data
 */
export function useWhitelist() {
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch whitelist from API
   */
  const fetchWhitelist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getWhitelist();
      setWhitelist(data);
    } catch (err) {
      setError('Error loading whitelist');
      console.error('Error fetching whitelist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch whitelist on mount
  useEffect(() => {
    fetchWhitelist();
  }, [fetchWhitelist]);

  /**
   * Create new whitelist
   */
  const createWhitelist = async (name: string, macs: string[]) => {
    try {
      const response = await apiClient.createWhitelist(name, macs);
      if (response.success) {
        await fetchWhitelist();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error creating whitelist' };
    }
  };

  /**
   * Update existing whitelist
   */
  const updateWhitelist = async (id: number, name: string, macs: string[]) => {
    try {
      const response = await apiClient.updateWhitelist(id, name, macs);
      if (response.success) {
        await fetchWhitelist();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error updating whitelist' };
    }
  };

  /**
   * Delete whitelist
   */
  const deleteWhitelist = async (id: number) => {
    try {
      const response = await apiClient.deleteWhitelist(id);
      if (response.success) {
        await fetchWhitelist();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error deleting whitelist' };
    }
  };

  /**
   * Add MAC to whitelist
   */
  const addMacToWhitelist = async (whitelistId: number, mac: string) => {
    try {
      const response = await apiClient.addMacToWhitelist(whitelistId, mac);
      if (response.success) {
        await fetchWhitelist();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error adding MAC to whitelist' };
    }
  };

  /**
   * Remove MAC from whitelist
   */
  const removeMacFromWhitelist = async (whitelistId: number, mac: string) => {
    try {
      const response = await apiClient.removeMacFromWhitelist(whitelistId, mac);
      if (response.success) {
        await fetchWhitelist();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error removing MAC from whitelist' };
    }
  };

  return {
    whitelist,
    isLoading,
    error,
    refetch: fetchWhitelist,
    createWhitelist,
    updateWhitelist,
    deleteWhitelist,
    addMacToWhitelist,
    removeMacFromWhitelist,
  };
}