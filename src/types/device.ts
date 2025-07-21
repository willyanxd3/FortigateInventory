// Device related types
export interface Device {
  // Basic identification
  ipv4_address: string;
  mac: string;
  hostname?: string;
  
  // Hardware information
  hardware_vendor?: string;
  hardware_type?: string;
  hardware_family?: string;
  
  // Operating system
  os_name?: string;
  os_version?: string;
  
  // Network configuration
  vdom?: string;
  detected_interface?: string;
  online_interfaces?: string[];
  
  // Timestamps (Unix timestamps)
  last_seen: number;
  active_start_time: number;
  
  // DHCP information
  host_src?: string;
  dhcp_lease_status?: string;
  dhcp_lease_expire?: number;
  dhcp_lease_reserved?: boolean;
  dhcp_server_id?: number;
  
  // FortiGate specific fields
  unjoined_forticlient_endpoint?: boolean;
  is_fortiguard_src?: boolean;
  purdue_level?: string;
  master_mac?: string;
  is_master_device?: boolean;
  is_detected_interface_role_wan?: boolean;
  detected_interface_fortitelemetry?: boolean;
  
  // Computed fields (added by our system)
  is_online: boolean;
  last_seen_formatted: string;
  active_start_time_formatted: string;
  dhcp_lease_expire_formatted?: string;
  is_within_retention: boolean;
  device_type: string;
}

// API response structure
export interface DeviceApiResponse {
  success: boolean;
  devices: Device[];
  total: number;
  using_mock_data?: boolean;
  config: {
    retention_hours: string;
    fortigate_ip: string;
  };
}