// src/bot/operacional/consultarProduto.js
const getProduto = require('../../utils/getProduto');

async function consultarProduto(codigoItem, client, contact, NAVIGATION_TEXT) {
  await client.sendMessage(contact, '🔎 Aguarde! Estamos processando sua solicitação...');

  try {
    const dados = await getProduto(codigoItem);

    if (dados.erro) {
      await client.sendMessage(contact, `⚠️ ${dados.erro}`);
    } else {
      let mensagem =
        `📦 *Detalhes do Produto ${codigoItem}*\n\n` +
        `• Código SKU: ${dados.codigo}\n` +
        `• Código de Barras: ${dados.codigobarras}\n` +
        `• Descrição: ${dados.descricao}\n\n`;

      const depositos = Object.entries(dados.depositos);

      if (depositos.length === 0) {
        mensagem += '❌ Não há lotes com estoque disponível.';
      } else {
        for (const [dep, lotes] of depositos) {
          mensagem += `\t*${dep}*\n`;
          lotes.forEach(({ lote, numero, saldodisponivel }) => {
			mensagem += `\t – Disponível: ${saldodisponivel} | Lote: ${numero}\n`;
          });
          mensagem += '\n';
        }
      }

      await client.sendMessage(contact, mensagem.trim());
    }
  } catch (err) {
    console.error('Erro ao consultar API:', err);
    await client.sendMessage(contact, '❌ Erro ao consultar o produto. Tente novamente mais tarde.');
  }

  // Volta ao menu
  await client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { consultarProduto };
