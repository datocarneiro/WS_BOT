const qrcode = require("qrcode-terminal");
  

  
const exemploQR = "https://api.whatsapp.com/send?phone=5599999999999";  // qualquer string
console.log("QRCODE TESTE :::::::::::::");
qrcode.generate(exemploQR, { small: false });

console.log("✅ QR Code gerado no terminal!");
