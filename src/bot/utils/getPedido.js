require('dotenv').config();

const API_KEY = process.env.API_KEY;
const COOKIE_AMPLO = process.env.COOKIE_AMPLO;

async function getPedido(numeroOrigem) {
  console.log('Estrou em getPedido')
  try {
    const response = await fetch('https://amplo.eship.com.br/v3/?api=&funcao=webServiceGetOrdem', {
      method: 'POST',
      headers: {
        'Api': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        numeroOrigem,
        armazem: 4
      })
    });

    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      return { erro: `Erro na consulta: ${response.status}` };
    }

    const result = await response.json();
    console.log('Resposta completa da API:', JSON.stringify(result, null, 2));
    return result?.corpo?.body?.dados?.[0] || null;

  } catch (error) {
    console.error('Erro ao buscar pedido:', error.message);
    return { erro: 'Número inválido ou erro na requisição.' };
  }
}

module.exports = getPedido;
