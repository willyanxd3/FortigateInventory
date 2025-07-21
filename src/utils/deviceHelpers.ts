import { Device, WhitelistItem } from '../types';

/**
 * Check if a device is authorized based on whitelist
 */
export function isDeviceAuthorized(device: Device, whitelist: WhitelistItem[]): boolean {
  const allAuthorizedMacs = whitelist.flatMap(item => item.macs);
  return allAuthorizedMacs.includes(device.mac);
}

/**
 * Get unique values from an array of objects for a specific property
 */
export function getUniqueValues<T>(items: T[], key: keyof T): T[keyof T][] {
  const values = items.map(item => item[key]);
  return Array.from(new Set(values)).filter(Boolean);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate MAC address format
 */
export function validateMacAddress(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * Format MAC address consistently
 */
export function formatMacAddress(mac: string): string {
  return mac.replace(/[:-]/g, '').match(/.{2}/g)?.join(':') || mac;
}

/**
 * Get device icon name based on hardware type
 */
export function getDeviceIconName(hardwareType: string): string {
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

/**
 * Get human-readable device type label
 */
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