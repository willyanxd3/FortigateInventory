import os from 'os';

/**
 * Server information routes handler
 */
export class ServerRoutes {
  /**
   * Get server information
   */
  static getServerInfo(req, res) {
    try {
      const networkInterfaces = os.networkInterfaces();
      let serverIP = 'localhost';
      
      // Find first non-loopback IP
      for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const address of addresses) {
          if (address.family === 'IPv4' && !address.internal) {
            serverIP = address.address;
            break;
          }
        }
        if (serverIP !== 'localhost') break;
      }
      
      res.json({
        success: true,
        server_ip: serverIP,
        port: 3001
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error getting server info'
      });
    }
  }
}