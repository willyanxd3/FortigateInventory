import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration file manager
 */
export class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '../../fortigate.conf');
  }

  /**
   * Read configuration from file
   */
  readConfig() {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      const config = {};
      
      configContent.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            config[key.trim()] = value.trim();
          }
        }
      });
      
      return config;
    } catch (error) {
      console.error('Error reading configuration:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Write configuration to file
   */
  writeConfig(config) {
    try {
      const configContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      
      fs.writeFileSync(this.configPath, configContent);
      return true;
    } catch (error) {
      console.error('Error writing configuration:', error);
      return false;
    }
  }

  /**
   * Update specific configuration values
   */
  updateConfig(updates) {
    const currentConfig = this.readConfig();
    const newConfig = { ...currentConfig, ...updates };
    return this.writeConfig(newConfig);
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return {
      FORTIGATE_IP: '172.31.254.1',
      FORTIGATE_TOKEN: 'SEU_TOKEN',
      USER: 'admin',
      SENHA: 'admin',
      RETENTION_HOURS: '2'
    };
  }
}

// Export singleton instance
export const configManager = new ConfigManager();