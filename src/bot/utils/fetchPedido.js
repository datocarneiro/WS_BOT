const fetch = require("node-fetch");

async function fetchPedido(ordem) {
  const response = await fetch('https://amplo.eship.com.br/v3/?api=&funcao=webServiceGetOrdem', {
    method: 'POST',
    headers: {
      'Api': '2dc02cfa7c2c7817e1b619cbcd14f7b0',
      'Content-Type': 'application/json',
      'Cookie': 'amplo=3rssk9gva7asg82g4objrqf1vh'
    },
    body: JSON.stringify({ ordem })
  });

  const result = await response.json();
  return result?.corpo?.body?.dados?.[0] || null;
}

module.exports = fetchPedido;
