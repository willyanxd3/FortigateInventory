import { useState, useEffect, useCallback } from 'react';
import { Device } from '../types';
import { apiClient } from '../services/apiClient';

/**
 * Hook for managing device data
 */
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch devices from API
   */
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getDevices();
      
      if (response.success) {
        setDevices(response.devices);
        
        if (response.using_mock_data) {
          setError('⚠️ Using demo data - FortiGate unavailable');
        }
      } else {
        setError('Error loading devices');
        setDevices(response.devices || []);
      }
    } catch (err) {
      setError('Server connection error');
      console.error('Error fetching devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch devices on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}