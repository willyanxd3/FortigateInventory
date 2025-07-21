/**
 * Mock device data for testing when FortiGate is unavailable
 */
export const mockDevices = [
  {
    ipv4_address: '172.31.254.175',
    mac: '00:0c:29:19:e4:4d',
    hardware_vendor: 'VMware',
    hardware_type: 'Server',
    hardware_family: 'Virtual Machine',
    vdom: 'root',
    os_name: 'Ubuntu',
    last_seen: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago (online)
    unjoined_forticlient_endpoint: false,
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
    last_seen: Math.floor(Date.now() / 1000) - 120, // 2 minutes ago (online)
    host_src: 'dhcp',
    unjoined_forticlient_endpoint: false,
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
    last_seen: Math.floor(Date.now() / 1000) - 60, // 1 minute ago (online)
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
    last_seen: Math.floor(Date.now() / 1000) - 900, // 15 minutes ago (online)
    active_start_time: Math.floor(Date.now() / 1000) - 10800, // 3 hours ago
    detected_interface: 'lan2',
    is_master_device: true,
    purdue_level: '3'
  },
  {
    ipv4_address: '172.31.254.202',
    mac: 'CC:DD:EE:FF:00:11',
    hostname: 'PHONE-RECENT',
    hardware_vendor: 'Apple',
    hardware_type: 'Mobile',
    hardware_family: 'iPhone',
    vdom: 'root',
    os_name: 'iOS',
    os_version: '17',
    last_seen: Math.floor(Date.now() / 1000) - 600, // 10 minutes ago (online)
    active_start_time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    detected_interface: 'lan1',
    is_master_device: true,
    purdue_level: '3'
  },
  {
    ipv4_address: '172.31.254.201',
    mac: '88:99:AA:BB:CC:DD',
    hostname: 'TABLET-OFFLINE',
    hardware_vendor: 'Samsung',
    hardware_type: 'Tablet',
    hardware_family: 'Galaxy',
    vdom: 'root',
    os_name: 'Android',
    os_version: '12',
    last_seen: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago (offline)
    active_start_time: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    detected_interface: 'lan1',
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
    last_seen: Math.floor(Date.now() / 1000) - 10800, // 3 hours ago (offline, filtered with 2h retention)
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
    last_seen: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago (offline, filtered with 2h retention)
    active_start_time: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
    detected_interface: 'lan1',
    is_master_device: true,
    purdue_level: '3'
  }
];