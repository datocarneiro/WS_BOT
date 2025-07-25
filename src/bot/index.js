const client = require("./client");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./handlers/handleMessage");
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

// Escuta as mensagens e processa
client.on("message", async (msg) => {
  await handleMessage(msg, client, menus);

});

// Inicializa o cliente e mantém o processo rodando
console.log("Inicializando cliente...");
client.initialize();
console.log("Cliente inicializado (chamada feita)");
