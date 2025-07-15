export interface Device {
  // Campos básicos
  ipv4_address: string;
  mac: string;
  hostname?: string;
  
  // Hardware
  hardware_vendor?: string;
  hardware_type?: string;
  hardware_family?: string;
  
  // Sistema Operacional
  os_name?: string;
  os_version?: string;
  
  // Rede
  vdom?: string;
  detected_interface?: string;
  online_interfaces?: string[];
  
  // Status e tempo
  last_seen: number;
  is_online: boolean;
  active_start_time: number;
  
  // DHCP
  host_src?: string;
  dhcp_lease_status?: string;
  dhcp_lease_expire?: number;
  dhcp_lease_reserved?: boolean;
  dhcp_server_id?: number;
  
  // FortiGate específico
  unjoined_forticlient_endpoint?: boolean;
  is_fortiguard_src?: boolean;
  purdue_level?: string;
  master_mac?: string;
  is_master_device?: boolean;
  is_detected_interface_role_wan?: boolean;
  detected_interface_fortitelemetry?: boolean;
  
  // Campos processados
  device_type: string;
  last_seen_formatted: string;
  active_start_time_formatted: string;
  dhcp_lease_expire_formatted?: string;
  is_within_retention: boolean;
}

export interface WhitelistItem {
  id: number;
  name: string;
  macs: string[];
  created_at: string;
}

export interface ApiResponse {
  success: boolean;
  devices: Device[];
  total: number;
  using_mock_data?: boolean;
  config: {
    retention_hours: string;
    fortigate_ip: string;
  };
}

export interface Stats {
  total: number;
  online: number;
  offline: number;
  authorized: number;
  unauthorized: number;
}

export interface Filters {
  search: string;
  os: string;
  mac: string;
  vendor: string;
  interface: string;
  online: string;
  authorized: string;
  device_type: string;
}