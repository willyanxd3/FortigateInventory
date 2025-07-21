import { Device, DeviceStats, WhitelistItem } from '../types';
import { isDeviceAuthorized } from './deviceHelpers';

/**
 * Calculate statistics for devices
 */
export function calculateDeviceStats(
  devices: Device[], 
  whitelist: WhitelistItem[]
): DeviceStats {
  const total = devices.length;
  const online = devices.filter(device => device.is_online).length;
  const offline = total - online;
  
  const authorized = devices.filter(device => 
    isDeviceAuthorized(device, whitelist)
  ).length;
  const unauthorized = total - authorized;

  return {
    total,
    online,
    offline,
    authorized,
    unauthorized
  };
}