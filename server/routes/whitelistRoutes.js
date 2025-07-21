import { whitelistDB } from '../config/database.js';

/**
 * Whitelist routes handler
 */
export class WhitelistRoutes {
  /**
   * Get all whitelists
   */
  static async getWhitelist(req, res) {
    try {
      const whitelist = await whitelistDB.getAll();
      res.json({
        success: true,
        whitelist
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching whitelist'
      });
    }
  }

  /**
   * Create new whitelist
   */
  static async createWhitelist(req, res) {
    try {
      const { name, macs } = req.body;
      const newList = await whitelistDB.create(name, macs);
      
      res.json({
        success: true,
        message: 'List created successfully',
        whitelist: newList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error creating list'
      });
    }
  }

  /**
   * Update whitelist
   */
  static async updateWhitelist(req, res) {
    try {
      const { id } = req.params;
      const { name, macs } = req.body;
      
      const updatedList = await whitelistDB.update(parseInt(id), name, macs);
      
      res.json({
        success: true,
        message: 'List updated successfully',
        whitelist: updatedList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating list'
      });
    }
  }

  /**
   * Delete whitelist
   */
  static async deleteWhitelist(req, res) {
    try {
      const { id } = req.params;
      await whitelistDB.delete(parseInt(id));
      
      res.json({
        success: true,
        message: 'List deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error deleting list'
      });
    }
  }

  /**
   * Add MAC to whitelist
   */
  static async addMacToWhitelist(req, res) {
    try {
      const { id } = req.params;
      const { mac } = req.body;
      
      await whitelistDB.addMac(parseInt(id), mac);
      
      res.json({
        success: true,
        message: 'MAC added to whitelist'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error adding MAC'
      });
    }
  }

  /**
   * Remove MAC from whitelist
   */
  static async removeMacFromWhitelist(req, res) {
    try {
      const { id, mac } = req.params;
      
      await whitelistDB.removeMac(parseInt(id), mac);
      
      res.json({
        success: true,
        message: 'MAC removed from whitelist'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error removing MAC'
      });
    }
  }
}