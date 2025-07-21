import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database.js';

// Route handlers
import { DeviceRoutes } from './routes/deviceRoutes.js';
import { ConfigRoutes } from './routes/configRoutes.js';
import { AuthRoutes } from './routes/authRoutes.js';
import { WhitelistRoutes } from './routes/whitelistRoutes.js';
import { ServerRoutes } from './routes/serverRoutes.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Initialize server
 */
async function initializeServer() {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');

    // Device routes
    app.get('/api/devices', DeviceRoutes.getDevices);
    app.get('/api/test-connection', DeviceRoutes.testConnection);

    // Configuration routes
    app.get('/api/config', ConfigRoutes.getConfig);
    app.post('/api/config', ConfigRoutes.saveConfig);

    // Authentication routes
    app.post('/api/login', AuthRoutes.login);

    // Whitelist routes
    app.get('/api/whitelist', WhitelistRoutes.getWhitelist);
    app.post('/api/whitelist', WhitelistRoutes.createWhitelist);
    app.put('/api/whitelist/:id', WhitelistRoutes.updateWhitelist);
    app.delete('/api/whitelist/:id', WhitelistRoutes.deleteWhitelist);
    app.post('/api/whitelist/:id/mac', WhitelistRoutes.addMacToWhitelist);
    app.delete('/api/whitelist/:id/mac/:mac', WhitelistRoutes.removeMacFromWhitelist);

    // Server info routes
    app.get('/api/server-info', ServerRoutes.getServerInfo);

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
      console.log(`🌐 Network access available`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('🔄 Trying to kill existing process...');
        
        import('child_process').then(({ exec }) => {
          exec(`lsof -ti:${PORT} | xargs kill -9`, (error) => {
            if (!error) {
              console.log('✅ Existing process killed, restarting...');
              setTimeout(() => {
                server.listen(PORT, '0.0.0.0', () => {
                  console.log(`🚀 Server restarted on port ${PORT}`);
                });
              }, 1000);
            } else {
              console.error('❌ Could not kill existing process. Please run: kill -9 $(lsof -ti:3001)');
              process.exit(1);
            }
          });
        });
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Start the server
initializeServer();