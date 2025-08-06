require('dotenv').config();

const API_KEY = process.env.API_KEY;
const COOKIE_AMPLO = process.env.COOKIE_AMPLO;

async function fetchPedido(codigoItem) {
    try {
        const response = await fetch('.eship.com.br/v3/?api&funcao=webServiceGetProduto', 
        {
        method: 'POST',
        headers: {
            'Api': API_KEY,
            'Content-Type': 'application/json',
            'Cookie': `amplo=${COOKIE_AMPLO}`
        },
        body: JSON.stringify({ 
            codigoItem,
            armazem: 4
        })
        });

        if (!response.ok) {
        console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        return { erro: `Erro na consulta: ${response.status}` };
        }

        const result = await response.json();
        return result?.corpo?.body?.dados?.[0] || null;

    } catch (error) {
        console.error('Erro ao buscar pedido:', error.message);
        return { erro: 'Número inválido ou erro na requisição.' };
    }
}

module.exports = fetchPedido;
