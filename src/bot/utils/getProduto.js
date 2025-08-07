// src/bot/utils/getProduto.js
require('dotenv').config();
const API_KEY = process.env.API_KEY;

async function getProduto(codigoItem) {
  try {
    const response = await fetch(
      'https://amplo.eship.com.br/v3/?api&funcao=webServiceGetSaldoEstoque',
      {
        method: 'POST',
        headers: {
          'Api': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigoItem, armazem: 4 }),
      }
    );

    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status}`);
      return { erro: `Erro na consulta: ${response.status}` };
    }

    const result = await response.json();
    const dados = result?.corpo?.body?.dados || [];

    if (dados.length === 0) {
      return { erro: 'Produto não encontrado ou sem dados de estoque.' };
    }

    // Campos principais (todos iguais em cada item)
    const { codigo, codigobarras, descricao } = dados[0];

    // Agrupa por depósito, filtrando só saldodisponivel > 0
    const depositos = dados.reduce((acc, item) => {
      const dispo = parseFloat(item.saldodisponivel);
      if (dispo > 0) {
        const dep = item.descricaoDeposito;
        if (!acc[dep]) acc[dep] = [];
        acc[dep].push({
          lote: item.pro_lote_id === '0' ? 'Sem lote' : item.pro_lote_id,
          numero: item.numero || '',
          saldodisponivel: dispo,
        });
      }
      return acc;
    }, {});

    return { codigo, codigobarras, descricao, depositos };
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return { erro: 'Erro na requisição.' };
  }
}

module.exports = getProduto;
