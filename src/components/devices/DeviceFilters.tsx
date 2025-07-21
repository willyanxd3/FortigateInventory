import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { DeviceFilters, Device } from '../../types';
import { getUniqueValues } from '../../utils';

interface DeviceFiltersProps {
  filters: DeviceFilters;
  onFiltersChange: (filters: DeviceFilters) => void;
  devices: Device[];
}

/**
 * Device filters component
 */
export function DeviceFiltersComponent({ filters, onFiltersChange, devices }: DeviceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get unique values for filter options
  const uniqueOS = getUniqueValues(devices, 'os_name');
  const uniqueVendors = getUniqueValues(devices, 'hardware_vendor');
  const uniqueInterfaces = getUniqueValues(devices, 'detected_interface');
  const uniqueDeviceTypes = getUniqueValues(devices, 'hardware_type');

  const handleFilterChange = (key: keyof DeviceFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      os: '',
      mac: '',
      vendor: '',
      interface: '',
      online: '',
      authorized: '',
      device_type: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
        >
          <Filter className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Global Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Global Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Hostname, IP, MAC, etc..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Device Type
            </label>
            <select
              value={filters.device_type}
              onChange={(e) => handleFilterChange('device_type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              {uniqueDeviceTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Operating System */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Operating System
            </label>
            <select
              value={filters.os}
              onChange={(e) => handleFilterChange('os', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              {uniqueOS.map(os => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vendor
            </label>
            <select
              value={filters.vendor}
              onChange={(e) => handleFilterChange('vendor', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              {uniqueVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
          </div>

          {/* MAC Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MAC Address
            </label>
            <input
              type="text"
              placeholder="Filter by MAC"
              value={filters.mac}
              onChange={(e) => handleFilterChange('mac', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Interface */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Interface
            </label>
            <select
              value={filters.interface}
              onChange={(e) => handleFilterChange('interface', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              {uniqueInterfaces.map(interfaceName => (
                <option key={interfaceName} value={interfaceName}>{interfaceName}</option>
              ))}
            </select>
          </div>

          {/* Online Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.online}
              onChange={(e) => handleFilterChange('online', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Authorization */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Authorization
            </label>
            <select
              value={filters.authorized}
              onChange={(e) => handleFilterChange('authorized', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="authorized">Authorized</option>
              <option value="unauthorized">Unauthorized</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}