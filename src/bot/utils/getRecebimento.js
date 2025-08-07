// src/bot/utils/getRecebimento.js
require('dotenv').config();
const API_KEY = process.env.API_KEY;

// Função auxiliar para buscar número e validade do lote
async function buscarDetalhesLote(idLote) {
  if (!idLote) return 'Sem lote';

  try {
    const response = await fetch(
      'https://amplo.eship.com.br/v3/?api&funcao=webServiceGetLote',
      {
        method: 'POST',
        headers: {
          'Api': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lote: idLote }),
      }
    );

    if (!response.ok) {
      console.warn(`⚠️ Lote ${idLote} - erro HTTP ${response.status}`);
      return 'Lote não encontrado';
    }

    const result = await response.json();

    // Verifica se dados é um array e se há ao menos 1 item
    const dados = result?.corpo?.body?.dados;
    const lote = Array.isArray(dados) && dados.length > 0 ? dados[0] : null;

    if (!lote) return 'Lote não encontrado';

    const numero = lote.numero || 'sem número';
    const validade = lote.dataValidade?.date
      ? new Date(lote.dataValidade.date).toLocaleDateString('pt-BR')
      : 'sem validade';

    return `Nº ${numero} (Val: ${validade})`;

  } catch (err) {
    console.error(`❌ Erro ao buscar lote ${idLote}:`, err);
    return 'Erro ao buscar lote';
  }
}



async function getRecebimento(codigoRB) {
  try {
    const response = await fetch(
      'https://amplo.eship.com.br/v3/?api&funcao=webServiceGetApontamentos',
      {
        method: 'POST',
        headers: {
          'Api': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recebimento: codigoRB }),
      }
    );

    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status}`);
      return { erro: `Erro na consulta: ${response.status}` };
    }

    const result = await response.json();
    const dados = result?.corpo?.body?.dados || [];

    if (dados.length === 0) {
      return { erro: 'Recebimento não encontrado ou sem apontamentos.' };
    }

    // Extrai dados do recebimento
    const primeiro = dados[0];
    const r = primeiro.volume.recebimento;
    const recebimento = {
      codigoRecebimento: r.codigoRecebimento,
      docRecebimento: r.docRecebimento,
      dataHora: r.dataHora.date,
      quantidadeVolumes: r.quantidadeVolumes,
      status: r.status?.descricao || '',
      depositoRecebimento: primeiro.deposito.descricao
    };

    // Agrupa apontamentos por volume (RC)
    const apontamentosPorRC = {};

	for (const item of dados) {
		const rc = item.volume?.codigo || 'SEM_RC';
		if (!apontamentosPorRC[rc]) apontamentosPorRC[rc] = [];

		// Ajuste para pegar o id do lote:
		let idLote = null;
		if (item.idLote) {
			idLote = item.idLote;
		} else if (typeof item.lote === 'object' && item.lote !== null) {
			idLote = item.lote.id;
		}


		let loteDescricao = 'Sem lote';
		if (idLote) {
			loteDescricao = await buscarDetalhesLote(idLote);
		}


		apontamentosPorRC[rc].push({
			produtoCodigo: item.produto.codigo,
			produtoDesc: item.produto.descricao,
			quantidadeApontada: item.quantidade,
			lote: loteDescricao,
			statusVolume: item.volume.status?.descricao || 'Desconhecido'
		});
	}



    return { recebimento, apontamentosPorRC };

  } catch (error) {
    console.error('Erro ao buscar apontamentos:', error);
    return { erro: 'Erro na requisição.' };
  }
}

module.exports = getRecebimento;
