// consultarPedido.js
const getPedido = require('../../utils/getPedido');

async function consultarPedido(pedido, client, contact, NAVIGATION_TEXT) {
    await client.sendMessage(contact, `🔎 Consultando pedido ${pedido}! Aguarde enquanto processamos sua solicitalção...`);

	try {
		console.log('Vai entar em getPedidos');
		const dados = await getPedido(pedido);

		console.log('DADOS:::', dados);

		if (!dados || Object.keys(dados).length === 0){
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
				`\t*Transporte:* ${nomeTransporte}\n` +
				`\t*Destinatário:* ${nomeDest}\n` +
				`\t*Razão Social:* ${razaoSocial}\n` +
				`\t*Status:* ${statusDesc}`;

			await client.sendMessage(contact, mensagem);
		}
	} catch (err) {
		console.error('Erro ao consultar API:', err);
		await client.sendMessage(contact, '❌ Erro ao consultar o pedido. Tente novamente mais tarde.');
	}

	await client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { consultarPedido };
