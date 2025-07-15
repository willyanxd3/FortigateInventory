import React, { useState, useMemo } from 'react';
import { Shield, Settings, Monitor, RefreshCw } from 'lucide-react';
import { useDevices } from './hooks/useDevices';
import { StatsCards } from './components/StatsCards';
import { DeviceFilters } from './components/DeviceFilters';
import { DeviceTable } from './components/DeviceTable';
import { DeviceModal } from './components/DeviceModal';
import { Pagination } from './components/Pagination';
import { WhitelistTab } from './components/WhitelistTab';
import { ConfigTab } from './components/ConfigTab';
import { Device, Filters } from './types';
import { calculateStats, filterDevices, paginateDevices } from './utils/deviceUtils';

function App() {
  const {
    devices,
    loading,
    error,
    whitelist,
    serverInfo,
    refetch,
    testConnection,
    saveConfig,
    saveWhitelist,
    updateWhitelist,
    deleteWhitelist,
    addToWhitelist,
    removeFromWhitelist
  } = useDevices();

  const [activeTab, setActiveTab] = useState<'devices' | 'whitelist' | 'config'>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    os: '',
    mac: '',
    vendor: '',
    interface: '',
    online: '',
    authorized: '',
    device_type: ''
  });

  // Calculate statistics
  const stats = useMemo(() => calculateStats(devices, whitelist), [devices, whitelist]);

  // Filter devices
  const filteredDevices = useMemo(() => 
    filterDevices(devices, filters, whitelist), 
    [devices, filters, whitelist]
  );

  // Paginate devices
  const totalPages = Math.ceil(filteredDevices.length / 20);
  const paginatedDevices = useMemo(() => 
    paginateDevices(filteredDevices, currentPage, 20), 
    [filteredDevices, currentPage]
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleAddToWhitelist = async (mac: string) => {
    // For simplicity, add to first list or create new one
    if (whitelist.length > 0) {
      await addToWhitelist(whitelist[0].id, mac);
    } else {
      await saveWhitelist({ name: 'Authorized Devices', macs: [mac] });
    }
  };

  const handleRemoveFromWhitelist = async (mac: string) => {
    // Remove from all lists containing the MAC
    for (const list of whitelist) {
      if (list.macs.includes(mac)) {
        await removeFromWhitelist(list.id, mac);
      }
    }
  };

  const tabs = [
    {
      id: 'devices' as const,
      label: 'Devices',
      icon: Monitor,
      count: devices.length
    },
    {
      id: 'whitelist' as const,
      label: 'Whitelist',
      icon: Shield,
      count: whitelist.length
    },
    {
      id: 'config' as const,
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  FortiGate Inventory
                </h1>
                <p className="text-gray-400">
                  Device Monitoring System
                  {serverInfo && (
                    <span className="ml-2 text-cyan-400">
                      • {serverInfo.server_ip}:{serverInfo.port}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800/20 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 px-2 py-1 bg-gray-700 text-xs rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading devices...</p>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && !loading && (
          <>
            <StatsCards stats={stats} />
            <DeviceFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
              devices={devices}
            />
            <DeviceTable 
              devices={paginatedDevices}
              whitelist={whitelist}
              onDeviceClick={setSelectedDevice}
              onAddToWhitelist={handleAddToWhitelist}
              onRemoveFromWhitelist={handleRemoveFromWhitelist}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Whitelist Tab */}
        {activeTab === 'whitelist' && (
          <WhitelistTab
            whitelist={whitelist}
            onSave={saveWhitelist}
            onUpdate={updateWhitelist}
            onDelete={deleteWhitelist}
          />
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
          <ConfigTab
            onTestConnection={testConnection}
            onSaveConfig={saveConfig}
          />
        )}
      </main>

      {/* Device Modal */}
      <DeviceModal
        device={selectedDevice}
        whitelist={whitelist}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
}

export default App;