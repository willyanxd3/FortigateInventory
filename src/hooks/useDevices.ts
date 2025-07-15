import { useState, useEffect } from 'react';
import { Device, ApiResponse, WhitelistItem } from '../types';

// Função para obter a URL base da API
const getApiBaseUrl = () => {
  // Se estivermos em desenvolvimento local, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Caso contrário, usar o mesmo host que está servindo o frontend
  return `http://${window.location.hostname}:3001`;
};

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [serverInfo, setServerInfo] = useState<{ server_ip: string; port: number } | null>(null);

  const apiBaseUrl = getApiBaseUrl();

  const fetchServerInfo = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/server-info`);
      const data = await response.json();
      
      if (data.success) {
        setServerInfo(data);
      }
    } catch (err) {
      console.error('Erro ao buscar informações do servidor:', err);
    }
  };

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/api/devices`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setDevices(data.devices);
        if (data.using_mock_data) {
          setError('⚠️ Usando dados de demonstração - FortiGate não disponível');
        }
      } else {
        setError('Erro ao carregar dispositivos');
        setDevices(data.devices || []);
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar dispositivos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhitelist = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist`);
      const data = await response.json();
      
      if (data.success) {
        setWhitelist(data.whitelist);
      }
    } catch (err) {
      console.error('Erro ao buscar whitelist:', err);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/test-connection`);
      const data = await response.json();
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'Erro de conexão',
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      };
    }
  };

  const saveConfig = async (config: { retention_hours: string }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao salvar configurações'
      };
    }
  };

  const saveWhitelist = async (whitelist: { name: string; macs: string[] }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whitelist),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchWhitelist();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao salvar whitelist'
      };
    }
  };

  const updateWhitelist = async (id: number, whitelist: { name: string; macs: string[] }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whitelist),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchWhitelist();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao atualizar whitelist'
      };
    }
  };

  const deleteWhitelist = async (id: number) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchWhitelist();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao deletar whitelist'
      };
    }
  };

  const addToWhitelist = async (whitelistId: number, mac: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist/${whitelistId}/mac`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mac }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchWhitelist();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao adicionar à whitelist'
      };
    }
  };

  const removeFromWhitelist = async (whitelistId: number, mac: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelist/${whitelistId}/mac/${encodeURIComponent(mac)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchWhitelist();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao remover da whitelist'
      };
    }
  };

  useEffect(() => {
    fetchServerInfo();
    fetchDevices();
    fetchWhitelist();
  }, []);

  return {
    devices,
    loading,
    error,
    whitelist,
    serverInfo,
    refetch: fetchDevices,
    testConnection,
    saveConfig,
    saveWhitelist,
    updateWhitelist,
    deleteWhitelist,
    addToWhitelist,
    removeFromWhitelist
  };
}