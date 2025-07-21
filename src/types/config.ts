// Configuration related types
export interface SystemConfig {
  retention_hours: string;
  fortigate_ip?: string;
  user?: string;
  senha?: string;
}

export interface ServerInfo {
  server_ip: string;
  port: number;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  devices_count?: number;
  fortigate_info?: {
    serial?: string;
    version?: string;
    build?: string;
  };
  error?: string;
}