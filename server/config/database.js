import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '../../inventory.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

/**
 * Initialize database tables
 */
export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Whitelist table
      db.run(`
        CREATE TABLE IF NOT EXISTS whitelist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Whitelist MACs table
      db.run(`
        CREATE TABLE IF NOT EXISTS whitelist_macs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          whitelist_id INTEGER,
          mac TEXT NOT NULL,
          FOREIGN KEY (whitelist_id) REFERENCES whitelist (id) ON DELETE CASCADE
        )
      `);

      console.log('✅ Database initialized successfully');
      resolve();
    });
  });
}

/**
 * Whitelist database operations
 */
export const whitelistDB = {
  // Get all whitelists
  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT w.*, GROUP_CONCAT(wm.mac) as macs
        FROM whitelist w
        LEFT JOIN whitelist_macs wm ON w.id = wm.whitelist_id
        GROUP BY w.id
        ORDER BY w.created_at DESC
      `;
      
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const result = rows.map(row => ({
          id: row.id,
          name: row.name,
          macs: row.macs ? row.macs.split(',') : [],
          created_at: row.created_at
        }));
        
        resolve(result);
      });
    });
  },

  // Create new whitelist
  create: (name, macs) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run('INSERT INTO whitelist (name) VALUES (?)', [name], function(err) {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          const whitelistId = this.lastID;
          
          if (macs.length > 0) {
            const stmt = db.prepare('INSERT INTO whitelist_macs (whitelist_id, mac) VALUES (?, ?)');
            
            macs.forEach(mac => {
              stmt.run(whitelistId, mac);
            });
            
            stmt.finalize();
          }
          
          db.run('COMMIT');
          resolve({ id: whitelistId, name, macs, created_at: new Date().toISOString() });
        });
      });
    });
  },

  // Update whitelist
  update: (id, name, macs) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Update name
        db.run('UPDATE whitelist SET name = ? WHERE id = ?', [name, id], (err) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          // Remove old MACs
          db.run('DELETE FROM whitelist_macs WHERE whitelist_id = ?', [id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
              return;
            }
            
            // Insert new MACs
            if (macs.length > 0) {
              const stmt = db.prepare('INSERT INTO whitelist_macs (whitelist_id, mac) VALUES (?, ?)');
              
              macs.forEach(mac => {
                stmt.run(id, mac);
              });
              
              stmt.finalize();
            }
            
            db.run('COMMIT');
            resolve({ id, name, macs, created_at: new Date().toISOString() });
          });
        });
      });
    });
  },

  // Delete whitelist
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run('DELETE FROM whitelist_macs WHERE whitelist_id = ?', [id], (err) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          db.run('DELETE FROM whitelist WHERE id = ?', [id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
              return;
            }
            
            db.run('COMMIT');
            resolve();
          });
        });
      });
    });
  },

  // Add MAC to whitelist
  addMac: (whitelistId, mac) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO whitelist_macs (whitelist_id, mac) VALUES (?, ?)', [whitelistId, mac], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  },

  // Remove MAC from whitelist
  removeMac: (whitelistId, mac) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM whitelist_macs WHERE whitelist_id = ? AND mac = ?', [whitelistId, mac], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
};

export default db;