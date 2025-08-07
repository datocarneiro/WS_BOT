// src/bot/operacional/consultarRecebimento.js
const getRecebimento = require('../../utils/getRecebimento');

async function consultarRecebimento(codigoRB, client, contact, NAVIGATION_TEXT) {
	await client.sendMessage(contact, '🔎 Aguarde! Processando seu recebimento...');

	try {
		const result = await getRecebimento(codigoRB);

		if (result.erro) {
			await client.sendMessage(contact, `⚠️ ${result.erro}`);
		} else {
		const { recebimento, apontamentosPorRC } = result;

		// Monta cabeçalho
		let msg =
			`📥 *Recebimento ${recebimento.codigoRecebimento}*\n` +
			`• Status Recebimento: ${recebimento.status}\n` +
			`• Doc/Descrição: ${recebimento.docRecebimento}\n` +
			`• Data/Hora: ${recebimento.dataHora}\n` +
			`• Total de Volumes: ${recebimento.quantidadeVolumes}\n` +
			`• Depósito: ${recebimento.depositoRecebimento}\n\n`;

		// Lista os apontamentos por RC
		for (const [rc, itens] of Object.entries(apontamentosPorRC)) {
			// Pega o status do primeiro item como status do volume
			const rcstatus = itens[0]?.statusVolume || 'Desconhecido';

			msg += `\t📦 *Volume cód: ${rc}* | Status Volume: ${rcstatus}\n`;

			itens.forEach(i => {
				msg += `\t\t– ${i.produtoCodigo} | ${i.produtoDesc}\n` +
					`\t\tQuantidade Apontada: ${i.quantidadeApontada} | Lote: ${i.lote}\n`;
			});

			msg += '\n';
		}


		await client.sendMessage(contact, msg.trim());
		}
	} catch (err) {
		console.error('Erro ao consultar recebimento:', err);
		await client.sendMessage(contact, '❌ Erro ao consultar recebimento. Tente novamente mais tarde.');
	}

	// Volta ao menu
  	await client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { consultarRecebimento };
