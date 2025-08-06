const boasVindas = [
  "Olá!",
  "Olá, bem vindo!",
  "Olá, tudo bem?",
  "Oi, como posso te ajudar?",
  "Oi, em que posso te ajudar?",
  "Bem-vindo! Em que posso ajudar?",
  "Bem-vindo!",
];

function mensagemInicial() {
  return boasVindas[Math.floor(Math.random() * boasVindas.length)];
}

module.exports = { mensagemInicial };
