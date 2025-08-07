const { menus } = require('../../menus/gerirMenus');
const { pushMenu, popMenu, getCurrentMenuText } = require('../utils/navegacao');

async function tratarMensagemTreinamento(msg, client, user, users) {
	const contact = msg.from;
	const bodyRaw = msg.body.trim();
	const body = bodyRaw.toLowerCase();

	// Ao entrar no menu de treinamento
	if (user.stage !== 'TREINAMENTO') {
		pushMenu(user, 'TREINAMENTO');
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}

	// Encerrar sessão
	if (body === '00' || body === 'encerrar sessão') {
		user.stage = 'ENDED';
		user.menuStack = [];
		return client.sendMessage(contact, 'Até a próxima!');
	}

	// Voltar para o menu anterior
	if (body === '0' || body === 'voltar') {
		popMenu(user);
		return client.sendMessage(contact, getCurrentMenuText(user));
	}

	////////////////////////////////////////////////////////////////////////////////////////////

	// Processar opção de treinamento
	const resp = menus.TREINAMENTO.getRandomResponse(bodyRaw);
	const NAVIGATION_TEXT = menus.TREINAMENTO.text;

	if (!resp) {
		// Resposta inválida → mostra mensagem de erro + menu
		await client.sendMessage(contact, '❌ Opção inválida.');
		return client.sendMessage(contact, NAVIGATION_TEXT);
	}

	// Resposta válida → mostra resposta + menu novamente
	await client.sendMessage(contact, resp);
	return client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { tratarMensagemTreinamento };
