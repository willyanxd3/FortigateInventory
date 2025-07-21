// Filter and statistics types
export interface DeviceFilters {
  search: string;
  os: string;
  mac: string;
  vendor: string;
  interface: string;
  online: string;
  authorized: string;
  device_type: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  authorized: number;
  unauthorized: number;
}