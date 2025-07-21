import { 
  DeviceApiResponse, 
  WhitelistApiResponse, 
  WhitelistOperationResponse,
  SystemConfig,
  ServerInfo,
  ConnectionTestResult
} from '../types';

/**
 * API Client for communicating with the backend
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getApiBaseUrl();
  }

  /**
   * Get the API base URL based on current environment
   */
  private getApiBaseUrl(): string {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    return `http://${hostname}:3001`;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Device related methods
  async getDevices(): Promise<DeviceApiResponse> {
    return this.fetchApi<DeviceApiResponse>('/api/devices');
  }

  // Authentication methods
  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    return this.fetchApi('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Server info methods
  async getServerInfo(): Promise<ServerInfo> {
    const response = await this.fetchApi<{ success: boolean } & ServerInfo>('/api/server-info');
    return {
      server_ip: response.server_ip,
      port: response.port,
    };
  }

  // Configuration methods
  async getConfig(): Promise<SystemConfig> {
    const response = await this.fetchApi<{ success: boolean; config: SystemConfig }>('/api/config');
    return response.config;
  }

  async saveConfig(config: Partial<SystemConfig>): Promise<{ success: boolean; message: string }> {
    return this.fetchApi('/api/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async testConnection(): Promise<ConnectionTestResult> {
    return this.fetchApi<ConnectionTestResult>('/api/test-connection');
  }

  // Whitelist methods
  async getWhitelist(): Promise<WhitelistItem[]> {
    const response = await this.fetchApi<WhitelistApiResponse>('/api/whitelist');
    return response.whitelist;
  }

  async createWhitelist(name: string, macs: string[]): Promise<WhitelistOperationResponse> {
    return this.fetchApi('/api/whitelist', {
      method: 'POST',
      body: JSON.stringify({ name, macs }),
    });
  }

  async updateWhitelist(id: number, name: string, macs: string[]): Promise<WhitelistOperationResponse> {
    return this.fetchApi(`/api/whitelist/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, macs }),
    });
  }

  async deleteWhitelist(id: number): Promise<WhitelistOperationResponse> {
    return this.fetchApi(`/api/whitelist/${id}`, {
      method: 'DELETE',
    });
  }

  async addMacToWhitelist(whitelistId: number, mac: string): Promise<WhitelistOperationResponse> {
    return this.fetchApi(`/api/whitelist/${whitelistId}/mac`, {
      method: 'POST',
      body: JSON.stringify({ mac }),
    });
  }

  async removeMacFromWhitelist(whitelistId: number, mac: string): Promise<WhitelistOperationResponse> {
    return this.fetchApi(`/api/whitelist/${whitelistId}/mac/${encodeURIComponent(mac)}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();