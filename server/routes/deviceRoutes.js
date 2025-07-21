import axios from 'axios';
import { configManager } from '../config/configManager.js';
import { mockDevices } from '../data/mockDevices.js';
import { processDevice } from '../utils/deviceUtils.js';

/**
 * Device routes handler
 */
export class DeviceRoutes {
  /**
   * Get devices from FortiGate or return mock data
   */
  static async getDevices(req, res) {
    try {
      const config = configManager.readConfig();
      let devices = [];
      let usingMockData = false;
      
      // Try to fetch real data from FortiGate
      try {
        const response = await axios.get(
          `https://${config.FORTIGATE_IP}/api/v2/monitor/user/device/query`,
          {
            headers: {
              'Authorization': `Bearer ${config.FORTIGATE_TOKEN}`,
              'accept': 'application/json'
            },
            httpsAgent: new (await import('https')).Agent({
              rejectUnauthorized: false
            }),
            timeout: 5000
          }
        );
        
        devices = response.data.results || [];
        console.log(`✅ Data obtained from FortiGate: ${devices.length} devices`);
      } catch (error) {
        console.log('⚠️  Using mock data - FortiGate unavailable:', error.message);
        devices = mockDevices;
        usingMockData = true;
      }
      
      // Process devices with computed fields
      const retentionHours = parseInt(config.RETENTION_HOURS || '2');
      const processedDevices = devices.map(device => processDevice(device, retentionHours));
      
      // Filter by retention period (0 = show all)
      const filteredDevices = retentionHours > 0 
        ? processedDevices.filter(device => device.is_within_retention)
        : processedDevices;
      
      res.json({
        success: true,
        devices: filteredDevices,
        total: filteredDevices.length,
        using_mock_data: usingMockData,
        config: {
          retention_hours: config.RETENTION_HOURS,
          fortigate_ip: config.FORTIGATE_IP
        }
      });
      
    } catch (error) {
      console.error('Error fetching devices:', error);
      
      // Return mock data as fallback
      const config = configManager.readConfig();
      const retentionHours = parseInt(config.RETENTION_HOURS || '2');
      const processedDevices = mockDevices.map(device => processDevice(device, retentionHours));
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        devices: processedDevices,
        using_mock_data: true
      });
    }
  }

  /**
   * Test connection to FortiGate
   */
  static async testConnection(req, res) {
    try {
      const config = configManager.readConfig();
      
      const response = await axios.get(
        `https://${config.FORTIGATE_IP}/api/v2/monitor/user/device/query`,
        {
          headers: {
            'Authorization': `Bearer ${config.FORTIGATE_TOKEN}`,
            'accept': 'application/json'
          },
          httpsAgent: new (await import('https')).Agent({
            rejectUnauthorized: false
          }),
          timeout: 5000
        }
      );
      
      res.json({
        success: true,
        message: 'FortiGate connection established successfully',
        devices_count: response.data.results?.length || 0,
        fortigate_info: {
          serial: response.data.serial,
          version: response.data.version,
          build: response.data.build
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error connecting to FortiGate',
        error: error.message
      });
    }
  }
}