const client = require("./client");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./handlers/handleMessage");  // CORRETO
const { menus } = require("../menus");


// Gera QR Code para autenticação
client.on("qr", (qr) => {
  console.log("Evento QR recebido");
  console.log("QR bruto:", qr); // sempre deve exibir algo como 'otpauth://...'
  qrcode.generate(qr, { small: true });
  console.log("📱 QR Code gerado, escaneie com seu WhatsApp!");
});


// Quando o cliente estiver pronto
client.on("ready", () => {
  console.log("✅ Bot está pronto!");
});

// //Recupera ID dos
// client.on('ready', async () => {
//     const chats = await client.getChats();

//     const grupos = chats.filter(chat => chat.isGroup);

//     grupos.forEach(group => {
//         console.log(`Nome: ${group.name} | ID: ${group.id._serialized}`);
//     });
// });


client.on("message", async (msg) => {
    // Ignora mensagens vindas de grupos
    if (msg.from.endsWith('@g.us')) return;
    // Processa apenas mensagens privada
    await handleMessage(msg, client);  // CORRETO
});


// Inicializa o cliente e mantém o processo rodando
console.log("Inicializando cliente...");
client.initialize();
console.log("Cliente inicializado (chamada feita)");
