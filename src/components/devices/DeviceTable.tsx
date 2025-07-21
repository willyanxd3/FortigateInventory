import React from 'react';
import { 
  Monitor, Wifi, WifiOff, Shield, ShieldAlert, 
  Smartphone, Tablet, Laptop, Server, Printer, Router, 
  Plus, Minus
} from 'lucide-react';
import { Device, WhitelistItem } from '../../types';
import { isDeviceAuthorized, truncateText, getDeviceIconName } from '../../utils';

interface DeviceTableProps {
  devices: Device[];
  whitelist: WhitelistItem[];
  onDeviceClick: (device: Device) => void;
  onAddToWhitelist?: (mac: string) => void;
  onRemoveFromWhitelist?: (mac: string) => void;
}

/**
 * Get React component for device icon
 */
const getDeviceIconComponent = (hardwareType: string) => {
  const iconName = getDeviceIconName(hardwareType);
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Smartphone: Smartphone,
    Tablet: Tablet,
    Laptop: Laptop,
    Monitor: Monitor,
    Server: Server,
    Printer: Printer,
    Router: Router,
    Wifi: Wifi,
    Shield: Shield
  };
  
  return iconMap[iconName] || Monitor;
};

/**
 * Device table component
 */
export function DeviceTable({ 
  devices, 
  whitelist, 
  onDeviceClick, 
  onAddToWhitelist, 
  onRemoveFromWhitelist 
}: DeviceTableProps) {
  if (devices.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
        <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300">No devices found</p>
      </div>
    );
  }

  const handleWhitelistAction = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation(); // Prevent opening modal
    
    const authorized = isDeviceAuthorized(device, whitelist);
    
    if (authorized && onRemoveFromWhitelist) {
      onRemoveFromWhitelist(device.mac);
    } else if (!authorized && onAddToWhitelist) {
      onAddToWhitelist(device.mac);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Icon</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">MAC</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">IP</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Interface</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Hostname</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Type</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Vendor</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">OS & Version</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Authorization</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {devices.map((device, index) => {
              const authorized = isDeviceAuthorized(device, whitelist);
              const DeviceIcon = getDeviceIconComponent(device.hardware_type || '');
              
              return (
                <tr
                  key={index}
                  onClick={() => onDeviceClick(device)}
                  className="hover:bg-gray-700/30 cursor-pointer transition-colors duration-200"
                >
                  {/* Icon */}
                  <td className="px-6 py-4">
                    <DeviceIcon className="w-5 h-5 text-cyan-400" />
                  </td>
                  
                  {/* Name (OS Name or hostname fallback) */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {truncateText(device.os_name || device.hostname || 'Unknown', 20)}
                    </div>
                  </td>
                  
                  {/* MAC */}
                  <td className="px-6 py-4 text-white">
                    <span className="font-mono text-sm">{device.mac}</span>
                  </td>
                  
                  {/* IP */}
                  <td className="px-6 py-4 text-gray-300">
                    {device.ipv4_address}
                  </td>
                  
                  {/* Interface */}
                  <td className="px-6 py-4 text-gray-300">
                    {device.detected_interface || 'N/A'}
                  </td>
                  
                  {/* Hostname */}
                  <td className="px-6 py-4 text-gray-300">
                    {truncateText(device.hostname || 'N/A', 20)}
                  </td>
                  
                  {/* Type */}
                  <td className="px-6 py-4 text-gray-300">
                    {truncateText(device.hardware_type || 'N/A', 15)}
                  </td>
                  
                  {/* Vendor */}
                  <td className="px-6 py-4 text-gray-300">
                    {truncateText(device.hardware_vendor || 'N/A', 15)}
                  </td>
                  
                  {/* OS & Version */}
                  <td className="px-6 py-4 text-gray-300">
                    <div className="text-sm">
                      <div>{device.os_name || 'N/A'}</div>
                      {device.os_version && (
                        <div className="text-xs text-gray-400">{truncateText(device.os_version, 12)}</div>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {device.is_online ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Wifi className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <WifiOff className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Offline</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Authorization */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {authorized ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Authorized</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Unauthorized</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleWhitelistAction(e, device)}
                      className={`p-2 rounded-lg transition-colors ${
                        authorized
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                      }`}
                      title={authorized ? 'Remove from Whitelist' : 'Add to Whitelist'}
                    >
                      {authorized ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}