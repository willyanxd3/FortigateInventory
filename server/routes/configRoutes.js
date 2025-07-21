import { configManager } from '../config/configManager.js';

/**
 * Configuration routes handler
 */
export class ConfigRoutes {
  /**
   * Get current configuration
   */
  static getConfig(req, res) {
    try {
      const config = configManager.readConfig();
      res.json({
        success: true,
        config: {
          retention_hours: config.RETENTION_HOURS,
          fortigate_ip: config.FORTIGATE_IP,
          user: config.USER,
          senha: config.SENHA
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error reading configuration'
      });
    }
  }

  /**
   * Save configuration
   */
  static saveConfig(req, res) {
    try {
      const { retention_hours, user, senha } = req.body;
      const updates = {};
      
      if (retention_hours !== undefined) updates.RETENTION_HOURS = retention_hours;
      if (user !== undefined) updates.USER = user;
      if (senha !== undefined) updates.SENHA = senha;
      
      const success = configManager.updateConfig(updates);
      
      if (success) {
        res.json({
          success: true,
          message: 'Configuration saved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error saving configuration'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error saving configuration'
      });
    }
  }
}