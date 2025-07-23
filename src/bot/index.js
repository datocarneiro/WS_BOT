const client = require("./client");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./handlers/handleMessage");
const { menus } = require("../menus");

// Gera QR Code para autenticação
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: false });
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
client.initialize();
