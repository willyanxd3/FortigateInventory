import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, whitelistDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Check if port is already in use
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🌐 Network access available`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('🔄 Trying to kill existing process...');
    
    // Try to kill existing process
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
// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
await initDatabase();

// Função para ler configurações do arquivo fortigate.conf
function readConfig() {
  try {
    const configPath = path.join(__dirname, '../fortigate.conf');
    const configContent = fs.readFileSync(configPath, 'utf8');
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
    console.error('Erro ao ler configurações:', error);
    return {
      FORTIGATE_IP: '172.31.254.1',
      FORTIGATE_TOKEN: 'SEU_TOKEN',
      RETENTION_HOURS: '2'
    };
  }
}

// Função para converter timestamp para formato legível
function convertTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('pt-BR');
}

// Função para verificar se dispositivo está dentro do tempo de retenção
function isWithinRetention(lastSeen, retentionHours) {
  if (!lastSeen) return false;
  const now = Math.floor(Date.now() / 1000);
  const retentionSeconds = retentionHours * 3600;
  return (now - lastSeen) <= retentionSeconds;
}

// Mock data para demonstração (baseado na resposta real do FortiGate)
const mockDevices = [
  {
    ipv4_address: '172.31.254.175',
    mac: '00:0c:29:19:e4:4d',
    hardware_vendor: 'VMware',
    hardware_type: 'Server',
    hardware_family: 'Virtual Machine',
    vdom: 'root',
    os_name: 'Ubuntu',
    last_seen: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
    unjoined_forticlient_endpoint: false,
    is_online: false,
    active_start_time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    is_fortiguard_src: true,
    purdue_level: '3',
    master_mac: '00:0c:29:19:e4:4d',
    detected_interface: 'lan1',
    is_master_device: true,
    is_detected_interface_role_wan: false,
    detected_interface_fortitelemetry: false
  },
  {
    ipv4_address: '172.31.254.179',
    mac: 'fa:71:3c:c1:93:fc',
    vdom: 'root',
    os_name: 'Android',
    os_version: '13',
    hostname: 'POCO-X4-Pro-5G',
    hardware_type: 'Mobile',
    last_seen: Math.floor(Date.now() / 1000) - 120, // 2 minutes ago
    host_src: 'dhcp',
    unjoined_forticlient_endpoint: false,
    is_online: true,
    active_start_time: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    dhcp_lease_status: 'leased',
    dhcp_lease_expire: Math.floor(Date.now() / 1000) + 86400,
    dhcp_lease_reserved: false,
    dhcp_server_id: 3,
    is_fortiguard_src: false,
    purdue_level: '3',
    master_mac: 'fa:71:3c:c1:93:fc',
    detected_interface: 'lan1',
    is_master_device: true,
    is_detected_interface_role_wan: false,
    detected_interface_fortitelemetry: false,
    online_interfaces: ['lan1']
  },
  {
    ipv4_address: '172.31.254.100',
    mac: 'AA:BB:CC:DD:EE:FF',
    hostname: 'DESKTOP-ABC123',
    hardware_vendor: 'Dell',
    hardware_type: 'Desktop',
    hardware_family: 'OptiPlex',
    vdom: 'root',
    os_name: 'Windows',
    os_version: '11',
    last_seen: Math.floor(Date.now() / 1000) - 60, // 1 minute ago
    is_online: true,
    active_start_time: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
    detected_interface: 'lan1',
    is_master_device: true,
    purdue_level: '3'
  },
  {
    ipv4_address: '172.31.254.200',
    mac: 'FF:EE:DD:CC:BB:AA',
    hostname: 'PRINTER-HP',
    hardware_vendor: 'HP',
    hardware_type: 'Printer',
    hardware_family: 'LaserJet',
    vdom: 'root',
    os_name: 'Embedded',
    last_seen: Math.floor(Date.now() / 1000) - 900, // 15 minutes ago
    is_online: true,
    active_start_time: Math.floor(Date.now() / 1000) - 10800, // 3 hours ago
    detected_interface: 'lan2',
    is_master_device: true,
    purdue_level: '3'
  },
  {
    ipv4_address: '172.31.254.150',
    mac: '11:22:33:44:55:66',
    hostname: 'LAPTOP-OFFLINE',
    hardware_vendor: 'Lenovo',
    hardware_type: 'Laptop',
    hardware_family: 'ThinkPad',
    vdom: 'root',
    os_name: 'Windows',
    os_version: '10',
    last_seen: Math.floor(Date.now() / 1000) - 10800, // 3 hours ago (offline)
    is_online: false,
    active_start_time: Math.floor(Date.now() / 1000) - 18000, // 5 hours ago
    detected_interface: 'lan1',
    is_master_device: true,
    purdue_level: '3'
  },
  {
    ipv4_address: '172.31.254.250',
    mac: '77:88:99:AA:BB:CC',
    hostname: 'OLD-DEVICE',
    hardware_vendor: 'Generic',
    hardware_type: 'Unknown',
    vdom: 'root',
    os_name: 'Unknown',
    last_seen: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago (should be filtered out with 2h retention)
    is_online: false,
    active_start_time: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
    detected_interface: 'lan1',
    is_master_device: true,
    purdue_level: '3'
  }
];

// Rota para buscar dispositivos
app.get('/api/devices', async (req, res) => {
  try {
    const config = readConfig();
    let devices = [];
    let usingMockData = false;
    
    // Tenta buscar dados reais do FortiGate
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
      console.log(`✅ Dados obtidos do FortiGate: ${devices.length} dispositivos`);
    } catch (error) {
      console.log('⚠️  Usando dados mock - FortiGate não disponível:', error.message);
      devices = mockDevices;
      usingMockData = true;
    }
    
    // Processa os dispositivos
    const processedDevices = devices.map(device => ({
      ...device,
      last_seen_formatted: convertTimestamp(device.last_seen),
      active_start_time_formatted: convertTimestamp(device.active_start_time),
      dhcp_lease_expire_formatted: device.dhcp_lease_expire ? convertTimestamp(device.dhcp_lease_expire) : null,
      is_within_retention: isWithinRetention(device.last_seen, parseInt(config.RETENTION_HOURS || '2'))
    }));
    
    // Filtra por tempo de retenção - incluir todos os dispositivos se retention for 0 ou não definido
    const retentionHours = parseInt(config.RETENTION_HOURS || '2');
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
    console.error('Erro ao buscar dispositivos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      devices: mockDevices.map(device => ({
        ...device,
        last_seen_formatted: convertTimestamp(device.last_seen),
        active_start_time_formatted: convertTimestamp(device.active_start_time),
        is_within_retention: isWithinRetention(device.last_seen, parseInt(config.RETENTION_HOURS || '2'))
      })),
      using_mock_data: true
    });
  }
});

// Rota para testar conexão com FortiGate
app.get('/api/test-connection', async (req, res) => {
  try {
    const config = readConfig();
    
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
      message: 'Conexão com FortiGate estabelecida com sucesso',
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
      message: 'Erro ao conectar com FortiGate',
      error: error.message
    });
  }
});

// Rota para obter configurações
app.get('/api/config', (req, res) => {
  try {
    const config = readConfig();
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
      error: 'Erro ao ler configurações'
    });
  }
});

// Rota para salvar configurações
app.post('/api/config', (req, res) => {
  try {
    const { retention_hours, user, senha } = req.body;
    const config = readConfig();
    
    if (retention_hours !== undefined) config.RETENTION_HOURS = retention_hours;
    if (user !== undefined) config.USER = user;
    if (senha !== undefined) config.SENHA = senha;
    
    const configContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(path.join(__dirname, '../fortigate.conf'), configContent);
    
    res.json({
      success: true,
      message: 'Configurações salvas com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar configurações'
    });
  }
});

// Rotas para whitelist usando SQLite
app.get('/api/whitelist', async (req, res) => {
  try {
    const whitelist = await whitelistDB.getAll();
    res.json({
      success: true,
      whitelist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar whitelist'
    });
  }
});

app.post('/api/whitelist', async (req, res) => {
  try {
    const { name, macs } = req.body;
    const newList = await whitelistDB.create(name, macs);
    
    res.json({
      success: true,
      message: 'Lista criada com sucesso',
      whitelist: newList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao criar lista'
    });
  }
});

app.put('/api/whitelist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, macs } = req.body;
    
    const updatedList = await whitelistDB.update(parseInt(id), name, macs);
    
    res.json({
      success: true,
      message: 'Lista atualizada com sucesso',
      whitelist: updatedList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar lista'
    });
  }
});

app.delete('/api/whitelist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await whitelistDB.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Lista removida com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao remover lista'
    });
  }
});

// Rota para adicionar MAC à whitelist
app.post('/api/whitelist/:id/mac', async (req, res) => {
  try {
    const { id } = req.params;
    const { mac } = req.body;
    
    await whitelistDB.addMac(parseInt(id), mac);
    
    res.json({
      success: true,
      message: 'MAC adicionado à whitelist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar MAC'
    });
  }
});

// Rota para remover MAC da whitelist
app.delete('/api/whitelist/:id/mac/:mac', async (req, res) => {
  try {
    const { id, mac } = req.params;
    
    await whitelistDB.removeMac(parseInt(id), mac);
    
    res.json({
      success: true,
      message: 'MAC removido da whitelist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao remover MAC'
    });
  }
});

// Rota para obter IP do servidor
app.get('/api/server-info', (req, res) => {
  import('os').then(os => {
  const networkInterfaces = os.networkInterfaces();
  let serverIP = 'localhost';
  
  // Encontrar o primeiro IP não-loopback
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
    port: PORT
  });
  });
});

// Rota para login
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const config = readConfig();
    
    if (username === config.USER && password === config.SENHA) {
      res.json({
        success: true,
        message: 'Login realizado com sucesso'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});
