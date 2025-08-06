const client = require("./client");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./handlers/handleMessage");

// Gera QR Code para autenticação
client.on("qr", (qr) => {
  console.log("QR bruto:", qr);
  qrcode.generate(qr, { small: true });
  console.log("📱 QR Code gerado, escaneie com seu WhatsApp!");
});


// Quando o cliente estiver pronto
client.on("ready", () => {
  console.log("✅ Bot está pronto!");
});




client.on("message", async (msg) => {
    // Ignora mensagens vindas de grupos
    if (msg.from.endsWith('@g.us')) return;
    // Processa apenas mensagens privada
    await handleMessage(msg, client);  // CORRETO
});

// //Recupera ID dos
// client.on('ready', async () => {
//     const chats = await client.getChats();
//     const grupos = chats.filter(chat => chat.isGroup);
//     grupos.forEach(group => {
//         console.log(`Nome: ${group.name} | ID: ${group.id._serialized}`);
//     });
// });


// Inicializa o cliente e mantém o processo rodando
console.log("Inicializando o cliente/processo de autenticaçã no Whats...");
client.initialize();
console.log("Cliente inicializado.")