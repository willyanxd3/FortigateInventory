import { Device, DeviceFilters, WhitelistItem } from '../types';
import { isDeviceAuthorized } from './deviceHelpers';

/**
 * Filter devices based on provided filters
 */
export function filterDevices(
  devices: Device[], 
  filters: DeviceFilters, 
  whitelist: WhitelistItem[]
): Device[] {
  return devices.filter(device => {
    // Global search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        device.hostname || '',
        device.ipv4_address,
        device.mac,
        device.os_name || '',
        device.hardware_vendor || '',
        device.hardware_type || '',
        device.detected_interface || ''
      ];
      
      const matchesSearch = searchableFields.some(field => 
        field && field.toLowerCase().includes(searchTerm)
      );
      
      if (!matchesSearch) return false;
    }

    // Operating system filter
    if (filters.os && device.os_name !== filters.os) {
      return false;
    }

    // MAC address filter
    if (filters.mac && !device.mac.toLowerCase().includes(filters.mac.toLowerCase())) {
      return false;
    }

    // Vendor filter
    if (filters.vendor && device.hardware_vendor !== filters.vendor) {
      return false;
    }

    // Interface filter
    if (filters.interface && device.detected_interface !== filters.interface) {
      return false;
    }

    // Device type filter
    if (filters.device_type && device.hardware_type !== filters.device_type) {
      return false;
    }

    // Online/offline status filter
    if (filters.online === 'online' && !device.is_online) {
      return false;
    }
    if (filters.online === 'offline' && device.is_online) {
      return false;
    }

    // Authorization filter
    const authorized = isDeviceAuthorized(device, whitelist);
    if (filters.authorized === 'authorized' && !authorized) {
      return false;
    }
    if (filters.authorized === 'unauthorized' && authorized) {
      return false;
    }

    return true;
  });
}

/**
 * Paginate devices array
 */
export function paginateDevices(
  devices: Device[], 
  page: number, 
  itemsPerPage: number = 20
): Device[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return devices.slice(startIndex, endIndex);
}