import React, { useState } from 'react';
import { useEffect } from 'react';
import { Settings, TestTube, Check, X } from 'lucide-react';

interface ConfigTabProps {
  onTestConnection: () => Promise<any>;
  onSaveConfig: (config: { retention_hours: string }) => Promise<any>;
  currentConfig?: { retention_hours: string };
}

export function ConfigTab({ onTestConnection, onSaveConfig, currentConfig }: ConfigTabProps) {
  const [retentionHours, setRetentionHours] = useState('2');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentConfig) {
      setRetentionHours(currentConfig.retention_hours);
    }
  }, [currentConfig]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTestConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error testing connection'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSaveConfig({ retention_hours: retentionHours });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-white">Settings</h2>
      </div>

      {/* Connection Test */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          FortiGate Connection Test
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <TestTube className="w-4 h-4" />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
                <p className={`font-medium ${
                  testResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResult.message}
                </p>
              </div>
              
              {testResult.success && testResult.devices_count !== undefined && (
                <p className="text-sm text-gray-300 mt-2">
                  Devices found: {testResult.devices_count}
                </p>
              )}
              
              {!testResult.success && testResult.error && (
                <p className="text-sm text-gray-300 mt-2">
                  Error: {testResult.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          General Settings
        </h3>
        
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Retention Time (hours)
            </label>
            <input
              type="number"
              min="0"
              max="168"
              value={retentionHours}
              onChange={(e) => setRetentionHours(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Devices will only be shown if seen within the last X hours (0 = show all)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* FortiGate Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          FortiGate Information
        </h3>
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="font-medium">IP & Token:</span> Configure in fortigate.conf file
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Endpoint:</span> /api/v2/monitor/user/device/query
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Mode:</span> Uses mock data if FortiGate is unavailable
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Retention:</span> Set to 0 to show all devices regardless of last seen time
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Online Status:</span> Devices are considered online if last seen ≤ 25 minutes
          </p>
        </div>
      </div>
    </div>
  );
}