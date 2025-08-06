const { menus } = require('../../../menus/gerirMenus');
const { pushMenu, popMenu, getCurrentMenuText } = require('../../utils/navegacao');
const { consultarPedido } = require('./consultarPedido');
const { consultarProduto} = require('./consultarProduto');

async function tratarMensagemOperacional(msg, client, user, users) {
	const contact = msg.from;
	const bodyRaw = msg.body.trim();
	const body = bodyRaw.toLowerCase();

	// Ao entrar em Operacional
	if (user.stage !== 'OPERACIONAL') {
		pushMenu(user, 'OPERACIONAL');
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}

	// Encerrar sessão
	if (body === '00' || body === 'encerrar sessão') {
		user.stage = 'ENDED';
		user.menuStack = [];
		await client.sendMessage(contact, 'Até a próxima!');
		return;
	}

	// Voltar para menu anterior
	if (body === '0' || body === 'voltar') {
		popMenu(user);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}

	// Fluxo operacional baseado no estágio atual
	switch (user.stage) {
		case 'OPERACIONAL': {
		const nextStage = menus.OPERACIONAL.options[bodyRaw];
		if (!nextStage) {
			await client.sendMessage(contact, '❌ Opção inválida.');
			await client.sendMessage(contact, menus.OPERACIONAL.text);
			return;
		}
		pushMenu(user, nextStage);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
		}

		case 'OPERACIONAL_PEDIDO_INPUT': {
			const pedido = bodyRaw;
			const NAVIGATION_TEXT = menus.OPERACIONAL.text;
			await consultarPedido(pedido, client, contact, NAVIGATION_TEXT);
			return;
		}

		case 'OPERACIONAL_SALDO_INPUT': {
		const codigoItem = bodyRaw;
		await consultarProduto(codigoItem, client, contact, NAVIGATION_TEXT);
		return;
		}

		default: {
		// Respostas diretas ou fallback para menu Operacional
		const direct = menus[user.stage];
		if (direct && direct.next === 'OPERACIONAL') {
			await client.sendMessage(contact, direct.text);
			pushMenu(user, 'OPERACIONAL');
			await client.sendMessage(contact, menus.OPERACIONAL.text);
			return;
		}
		// Fallback geral
		popMenu(user);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
		}
	}
}

module.exports = { tratarMensagemOperacional };
