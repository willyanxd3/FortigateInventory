import { configManager } from '../config/configManager.js';

/**
 * Authentication routes handler
 */
export class AuthRoutes {
  /**
   * Login user
   */
  static login(req, res) {
    try {
      const { username, password } = req.body;
      const config = configManager.readConfig();
      
      if (username === config.USER && password === config.SENHA) {
        res.json({
          success: true,
          message: 'Login successful'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}