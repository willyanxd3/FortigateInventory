import { Device, Stats, Filters, WhitelistItem } from '../types';

export function isDeviceAuthorized(device: Device, whitelist: WhitelistItem[]): boolean {
  const allMacs = whitelist.flatMap(item => item.macs);
  return allMacs.includes(device.mac);
}

export function calculateStats(devices: Device[], whitelist: WhitelistItem[]): Stats {
  const online = devices.filter(device => device.is_online).length;
  const offline = devices.length - online;
  const authorized = devices.filter(device => isDeviceAuthorized(device, whitelist)).length;
  const unauthorized = devices.length - authorized;

  return {
    total: devices.length,
    online,
    offline,
    authorized,
    unauthorized
  };
}

export function filterDevices(devices: Device[], filters: Filters, whitelist: WhitelistItem[]): Device[] {
  return devices.filter(device => {
    // Filtro de busca global
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
      
      if (!searchableFields.some(field => 
        field && field.toLowerCase().includes(searchTerm)
      )) {
        return false;
      }
    }

    // Filtro por sistema operacional
    if (filters.os && device.os_name !== filters.os) {
      return false;
    }

    // Filtro por MAC
    if (filters.mac && !device.mac.toLowerCase().includes(filters.mac.toLowerCase())) {
      return false;
    }

    // Filtro por vendor
    if (filters.vendor && device.hardware_vendor !== filters.vendor) {
      return false;
    }

    // Filtro por interface
    if (filters.interface && device.detected_interface !== filters.interface) {
      return false;
    }

    // Filtro por tipo de dispositivo
    if (filters.device_type && device.hardware_type !== filters.device_type) {
      return false;
    }

    // Filtro por status online/offline
    if (filters.online === 'online' && !device.is_online) {
      return false;
    }
    if (filters.online === 'offline' && device.is_online) {
      return false;
    }

    // Filtro por autorização
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

export function paginateDevices(devices: Device[], page: number, perPage: number = 20): Device[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return devices.slice(start, end);
}

export function getUniqueValues<T>(items: T[], key: keyof T): T[keyof T][] {
  const values = items.map(item => item[key]);
  return Array.from(new Set(values)).filter(Boolean);
}

export function formatMac(mac: string): string {
  return mac.replace(/[:-]/g, '').match(/.{2}/g)?.join(':') || mac;
}

export function validateMac(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getDeviceIcon(hardwareType: string): string {
  const type = (hardwareType || '').toLowerCase();
  const iconMap: { [key: string]: string } = {
    phone: 'Smartphone',
    mobile: 'Smartphone',
    tablet: 'Tablet',
    laptop: 'Laptop',
    notebook: 'Laptop',
    desktop: 'Monitor',
    computer: 'Monitor',
    server: 'Server',
    printer: 'Printer',
    router: 'Router',
    switch: 'Router',
    'access point': 'Wifi',
    firewall: 'Shield',
    default: 'Monitor'
  };
  
  // Check for partial matches
  for (const key in iconMap) {
    if (type.includes(key)) {
      return iconMap[key];
    }
  }
  
  return iconMap.default;
}

export function getDeviceTypeLabel(hardwareType: string): string {
  const type = (hardwareType || '').toLowerCase();
  const labelMap: { [key: string]: string } = {
    phone: 'Phone',
    mobile: 'Mobile',
    tablet: 'Tablet',
    laptop: 'Laptop',
    notebook: 'Laptop',
    desktop: 'Desktop',
    computer: 'Computer',
    server: 'Server',
    printer: 'Printer',
    router: 'Router',
    switch: 'Switch',
    'access point': 'Access Point',
    firewall: 'Firewall',
    default: 'Device'
  };
  
  // Check for partial matches
  for (const key in labelMap) {
    if (type.includes(key)) {
      return labelMap[key];
    }
  }
  
  return labelMap.default;
}

export function categorizeDeviceInfo(device: Device) {
  return {
    basic: {
      title: 'Basic Information',
      fields: [
        { label: 'Hostname', value: device.hostname || 'N/A' },
        { label: 'IP Address', value: device.ipv4_address },
        { label: 'MAC Address', value: device.mac },
        { label: 'Device Type', value: device.hardware_type || 'N/A' },
        { label: 'VDOM', value: device.vdom || 'N/A' }
      ]
    },
    system: {
      title: 'Operating System',
      fields: [
        { label: 'OS Name', value: device.os_name || 'N/A' },
        { label: 'OS Version', value: device.os_version || 'N/A' }
      ]
    },
    hardware: {
      title: 'Hardware',
      fields: [
        { label: 'Vendor', value: device.hardware_vendor || 'N/A' },
        { label: 'Type', value: device.hardware_type || 'N/A' },
        { label: 'Family', value: device.hardware_family || 'N/A' }
      ]
    },
    network: {
      title: 'Network',
      fields: [
        { label: 'Detected Interface', value: device.detected_interface || 'N/A' },
        { label: 'Online Interfaces', value: device.online_interfaces?.join(', ') || 'N/A' },
        { label: 'Is WAN Interface', value: device.is_detected_interface_role_wan ? 'Yes' : 'No' },
        { label: 'Interface Telemetry', value: device.detected_interface_fortitelemetry ? 'Yes' : 'No' }
      ]
    },
    dhcp: {
      title: 'DHCP',
      fields: [
        { label: 'Host Source', value: device.host_src || 'N/A' },
        { label: 'Lease Status', value: device.dhcp_lease_status || 'N/A' },
        { label: 'Lease Expiration', value: device.dhcp_lease_expire_formatted || 'N/A' },
        { label: 'Reserved Lease', value: device.dhcp_lease_reserved ? 'Yes' : 'No' },
        { label: 'DHCP Server ID', value: device.dhcp_server_id?.toString() || 'N/A' }
      ]
    },
    security: {
      title: 'Security & Monitoring',
      fields: [
        { label: 'FortiClient Endpoint', value: device.unjoined_forticlient_endpoint ? 'Not Joined' : 'Joined' },
        { label: 'FortiGuard Source', value: device.is_fortiguard_src ? 'Yes' : 'No' },
        { label: 'Purdue Level', value: device.purdue_level || 'N/A' },
        { label: 'MAC Master', value: device.master_mac || 'N/A' },
        { label: 'Master Device', value: device.is_master_device ? 'Yes' : 'No' }
      ]
    },
    activity: {
      title: 'Activity',
      fields: [
        { label: 'Status', value: device.is_online ? 'Online' : 'Offline' },
        { label: 'Last Seen', value: device.last_seen_formatted },
        { label: 'Activity Start', value: device.active_start_time_formatted }
      ]
    }
  };
}