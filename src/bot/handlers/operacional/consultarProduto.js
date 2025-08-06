// consultarPedido.js
const fetchProduto = require('../../utils/getProduto');

async function consultarProduto(codigoItem, client, contact, NAVIGATION_TEXT) {
	await client.sendMessage(contact, `🔎 Consultando pedido ${pedido}, aguarde...`);

	try {
		const dados = await fetchPedido(pedido);

		if (!dados) {
			await client.sendMessage(contact, `⚠️ Pedido ${pedido} não encontrado.`);
		} else if (dados.erro) {
			await client.sendMessage(contact, `⚠️ Erro: ${dados.erro}`);
		} else {
			const nomeTransporte = dados.transportes?.[0]?.nome || 'Não informado';
			const nomeDest = dados.destinatario?.nome || 'Não informado';
			const razaoSocial = dados.destinatario?.razaoSocial || 'Não informado';
			const statusDesc = dados.status?.descricao || 'Não informado';

			const mensagem =
				`📦 *Detalhes do Pedido ${pedido}*:\n\n` +
				`🚚 *Transporte:* ${nomeTransporte}\n` +
				`👤 *Destinatário:* ${nomeDest}\n` +
				`🏢 *Razão Social:* ${razaoSocial}\n` +
				`📋 *Status:* ${statusDesc}`;

			await client.sendMessage(contact, mensagem);
		}
	} catch (err) {
		console.error('Erro ao consultar API:', err);
		await client.sendMessage(contact, '❌ Erro ao consultar o pedido. Tente novamente mais tarde.');
	}

	await client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { consultarProduto };
