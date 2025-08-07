const { menus } = require('../../../menus/gerirMenus');
const { pushMenu, popMenu, getCurrentMenuText } = require('../../utils/navegacao');
const { consultarPedido } = require('./consultarPedido');
const { consultarProduto } = require('./consultarProduto');

async function tratarMensagemOperacional(msg, client, user, users) {
	const contact = msg.from;
	const bodyRaw = msg.body.trim();
	const body = bodyRaw.toLowerCase();

	// DEBUG: início de função
	console.log('===== iniciar tratarMensagemOperacional =====');
	console.log('user.stage antes:', user.stage);
	console.log('bodyRaw:', bodyRaw);


	// Encerrar sessão
	if (body === '00' || body === 'encerrar sessão') {
		console.log('>> comando de encerrar sessão');
		user.stage = 'ENDED';
		user.menuStack = [];
		await client.sendMessage(contact, 'Até a próxima!');
		return;
	}

	// Voltar para menu anterior
	if (body === '0' || body === 'voltar') {
		console.log('>> comando de voltar');
		popMenu(user);
		console.log('user.stage após popMenu:', user.stage);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}

	// DEBUG: antes do switch
	console.log('>> entrando no switch de stage:', user.stage);

	switch (user.stage) {
		case 'OPERACIONAL': {
			const nextStage = menus.OPERACIONAL.options[bodyRaw];
			console.log('NEXTSTAGE encontrado em menus.OPERACIONAL.options:', nextStage);

			if (!nextStage) {
				console.log('>> opção inválida para OPERACIONAL:', bodyRaw);
				await client.sendMessage(contact, '❌ Opção inválida.');
				await client.sendMessage(contact, menus.OPERACIONAL.text);
				return;
			}

			console.log(`>> pushMenu para stage "${nextStage}"`);
			pushMenu(user, nextStage);
			console.log('user.stage após pushMenu:', user.stage);
			await client.sendMessage(contact, getCurrentMenuText(user));
			return;
		}

		case 'OPERACIONAL_PEDIDO_INPUT': {
			console.log('>> caso OPERACIONAL_PEDIDO_INPUT. Chamando consultarPedido');
			const pedido = bodyRaw;
			const pedidoTratado = pedido.trim();
			const NAVIGATION_TEXT = menus.OPERACIONAL.text;
			await consultarPedido(pedidoTratado, client, contact, NAVIGATION_TEXT);
			popMenu(user);
			return;
		}

		case 'OPERACIONAL_SALDO_INPUT': {
			console.log('>> caso OPERACIONAL_SALDO_INPUT. Chamando consultarProduto');
			const codigoItem = bodyRaw;
			const codigoItemTratado = codigoItem.trim();
			const NAVIGATION_TEXT = menus.OPERACIONAL.text;
			await consultarProduto(codigoItemTratado, client, contact, NAVIGATION_TEXT);
			popMenu(user);
			return;
		}

		default: {
			console.log('>> caso default para stage:', user.stage);
			const direct = menus[user.stage];
			if (direct && direct.next === 'OPERACIONAL') {
				console.log('>> direct.next é OPERACIONAL, enviando texto e voltando');
				await client.sendMessage(contact, direct.text);
				pushMenu(user, 'OPERACIONAL');
				await client.sendMessage(contact, menus.OPERACIONAL.text);
				console.log('user.stage após voltar ao OPERACIONAL:', user.stage);
				return;
			}
			console.log('>> fallback geral, popMenu');
			popMenu(user);
			await client.sendMessage(contact, getCurrentMenuText(user));
			console.log('user.stage após fallback:', user.stage);
			return;
		}
	}
}

module.exports = { tratarMensagemOperacional };
