import React from 'react';
import { 
  X, Monitor, Wifi, WifiOff, Shield, ShieldAlert, Clock, Network,
  Smartphone, Tablet, Laptop, Server, Printer, Router, Info
} from 'lucide-react';
import { Device, WhitelistItem } from '../../types';
import { isDeviceAuthorized, getDeviceIconName } from '../../utils';

interface DeviceModalProps {
  device: Device | null;
  whitelist: WhitelistItem[];
  onClose: () => void;
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
 * Device details modal component
 */
export function DeviceModal({ device, whitelist, onClose }: DeviceModalProps) {
  if (!device) return null;

  const authorized = isDeviceAuthorized(device, whitelist);
  const DeviceIcon = getDeviceIconComponent(device.hardware_type || '');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                <DeviceIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {device.os_name || device.hostname || 'Unknown Device'}
                </h2>
                <p className="text-gray-300 text-sm">
                  {device.hardware_type || 'Unknown Type'} • {device.hardware_vendor || 'Unknown Vendor'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Online Status */}
            <div className={`p-4 rounded-lg border ${
              device.is_online 
                ? 'bg-green-500/10 border-green-500/30 shadow-green-500/20' 
                : 'bg-red-500/10 border-red-500/30 shadow-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {device.is_online ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-sm text-gray-300">Status</p>
                  <p className={`font-medium ${
                    device.is_online ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {device.is_online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Authorization Status */}
            <div className={`p-4 rounded-lg border ${
              authorized 
                ? 'bg-purple-500/10 border-purple-500/30 shadow-purple-500/20' 
                : 'bg-orange-500/10 border-orange-500/30 shadow-orange-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {authorized ? (
                  <Shield className="w-5 h-5 text-purple-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-orange-400" />
                )}
                <div>
                  <p className="text-sm text-gray-300">Authorization</p>
                  <p className={`font-medium ${
                    authorized ? 'text-purple-400' : 'text-orange-400'
                  }`}>
                    {authorized ? 'Authorized' : 'Unauthorized'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Interface */}
            <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/30 shadow-blue-500/20">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-300">Interface</p>
                  <p className="font-medium text-blue-400">
                    {device.detected_interface || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Last Seen */}
            <div className="p-4 rounded-lg border bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-300">Last Seen</p>
                  <p className="font-medium text-yellow-400 text-xs">
                    {device.last_seen_formatted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Hostname:</span>
                  <span className="text-white font-medium">{device.hostname || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">IP Address:</span>
                  <span className="text-white font-mono">{device.ipv4_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">MAC Address:</span>
                  <span className="text-white font-mono text-sm">{device.mac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">VDOM:</span>
                  <span className="text-white">{device.vdom || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Hardware Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Hardware</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span className="text-white">{device.hardware_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Vendor:</span>
                  <span className="text-white">{device.hardware_vendor || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Family:</span>
                  <span className="text-white">{device.hardware_family || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* System Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Operating System</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">OS Name:</span>
                  <span className="text-white">{device.os_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">OS Version:</span>
                  <span className="text-white">{device.os_version || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Network Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Network</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Interface:</span>
                  <span className="text-white">{device.detected_interface || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Online Interfaces:</span>
                  <span className="text-white text-sm">{device.online_interfaces?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">WAN Interface:</span>
                  <span className="text-white">{device.is_detected_interface_role_wan ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            
            {/* DHCP Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">DHCP</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Host Source:</span>
                  <span className="text-white">{device.host_src || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Lease Status:</span>
                  <span className="text-white">{device.dhcp_lease_status || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Lease Expires:</span>
                  <span className="text-white text-xs">{device.dhcp_lease_expire_formatted || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Activity Information */}
            <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Seen:</span>
                  <span className="text-white text-xs">{device.last_seen_formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Activity Start:</span>
                  <span className="text-white text-xs">{device.active_start_time_formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Master Device:</span>
                  <span className="text-white">{device.is_master_device ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}