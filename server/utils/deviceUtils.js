/**
 * Convert Unix timestamp to formatted date string
 */
export function convertTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US');
}

/**
 * Check if device is within retention period
 */
export function isWithinRetention(lastSeen, retentionHours) {
  if (!lastSeen) return false;
  if (retentionHours === 0) return true; // Show all devices if retention is 0
  
  const now = Math.floor(Date.now() / 1000);
  const retentionSeconds = retentionHours * 3600;
  return (now - lastSeen) <= retentionSeconds;
}

/**
 * Determine if device is online based on last_seen timestamp
 * Device is considered online if last_seen <= 25 minutes
 */
export function isDeviceOnline(lastSeen) {
  if (!lastSeen) return false;
  
  const now = Math.floor(Date.now() / 1000);
  const offlineThresholdSeconds = 25 * 60; // 25 minutes in seconds
  return (now - lastSeen) <= offlineThresholdSeconds;
}

/**
 * Process device data with computed fields
 */
export function processDevice(device, retentionHours) {
  return {
    ...device,
    // Compute online status based on last_seen
    is_online: isDeviceOnline(device.last_seen),
    
    // Format timestamps
    last_seen_formatted: convertTimestamp(device.last_seen),
    active_start_time_formatted: convertTimestamp(device.active_start_time),
    dhcp_lease_expire_formatted: device.dhcp_lease_expire ? convertTimestamp(device.dhcp_lease_expire) : null,
    
    // Check retention
    is_within_retention: isWithinRetention(device.last_seen, parseInt(retentionHours || '2')),
    
    // Set device type for consistency
    device_type: device.hardware_type || 'Unknown'
  };
}