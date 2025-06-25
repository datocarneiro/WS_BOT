const greetings = [
  "Olá!",
  "Olá, tudo bem?",
  "Oi, como posso te ajudar?",
  "Bem-vindo! Em que posso ajudar?",
  "Oi, tudo certo por aí?"
];

function randomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

module.exports = { randomGreeting };
