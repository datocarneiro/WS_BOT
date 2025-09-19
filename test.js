const { Client, LocalAuth } = require('whatsapp-web.js');
const c = new Client({ authStrategy: new LocalAuth({ dataPath: './testsess' }) });

c.on('qr', qr => console.log('QR =>', qr));
c.on('ready', () => console.log('✅ READY OK'));
c.on('auth_failure', msg => console.error('Auth failure:', msg));
c.initialize();
