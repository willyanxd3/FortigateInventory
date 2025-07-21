import { useState, useEffect, useCallback } from 'react';
import { SystemConfig, ServerInfo, ConnectionTestResult } from '../types';
import { apiClient } from '../services/apiClient';

/**
 * Hook for managing system configuration
 */
export function useConfig() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch configuration from API
   */
  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [configData, serverData] = await Promise.all([
        apiClient.getConfig(),
        apiClient.getServerInfo(),
      ]);
      
      setConfig(configData);
      setServerInfo(serverData);
    } catch (err) {
      setError('Error loading configuration');
      console.error('Error fetching config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /**
   * Save configuration
   */
  const saveConfig = async (newConfig: Partial<SystemConfig>) => {
    try {
      const response = await apiClient.saveConfig(newConfig);
      if (response.success) {
        await fetchConfig();
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Error saving configuration' };
    }
  };

  /**
   * Test FortiGate connection
   */
  const testConnection = async (): Promise<ConnectionTestResult> => {
    try {
      return await apiClient.testConnection();
    } catch (error) {
      return {
        success: false,
        message: 'Connection error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  return {
    config,
    serverInfo,
    isLoading,
    error,
    refetch: fetchConfig,
    saveConfig,
    testConnection,
  };
}