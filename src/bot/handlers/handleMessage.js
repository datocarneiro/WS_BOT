// src/bot/handlers/handleMessage.js

const { menus } = require('../../menus/gerirMenus');
const { mensagemInicial } = require('../../utils/mensagemInicial');
const { tratarMensagemOperacional } = require('./operacional/operacional');
const { tratarMensagemFinanceiro } = require('./financeiro');
const { tratarMensagemEquipeTec } = require('./equipeTec');
const { tratarMensagemTreinamento } = require('./treinamento');
const { popMenu, pushMenu, getCurrentMenuText } = require('../utils/navegacao');

const users = new Map();

/* Anotação para eu não esquecer - Essa função é responsavel por gerir a menssagem*/
async function handleMessage(msg, client) {
	const contact = msg.from;
	const bodyRaw = msg.body.trim();
	const body = bodyRaw.toLowerCase();

	let user = users.get(contact);
	if (!user || user.stage === 'ENDED') {
		users.set(contact, { stage: 'MENUPRINCIPAL', menuStack: ['MENUPRINCIPAL'] });
		await client.sendMessage(contact, mensagemInicial());
		await client.sendMessage(contact, menus.MENUPRINCIPAL.text);
		return;
	}

	user = users.get(contact);
	console.log('STAGE::::', user.stage, user.menuStack);
	
	// Encerrar sessão
	if (body === '#' || body === 'encerrar sessão') {
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

	// Menu Principal
	if (user.stage === 'MENUPRINCIPAL') {
		const choice = menus.MENUPRINCIPAL.options[bodyRaw];
		if (!choice) {
			await client.sendMessage(contact, '❌ Opção inválida.');
			await client.sendMessage(contact, menus.MENUPRINCIPAL.text);
			return;
		}
		pushMenu(user, choice);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}

	// Delegar aos handlers específicos
	if (user.stage.startsWith('OPERACIONAL')) {
		return tratarMensagemOperacional(msg, client, user, users);
	}
	if (user.stage.startsWith('FINANCEIRO')) {
		return tratarMensagemFinanceiro(msg, client, user, users);
	}
	if (user.stage.startsWith('EQUIPE_TEC') || user.stage === 'CHAMADO') {
		return tratarMensagemEquipeTec(msg, client, user, users);
	}  
	if (user.stage.startsWith('TREINAMENTO')) {
		return tratarMensagemTreinamento(msg, client, user, users);
	}

	// Fallback: garante retorno ao MAIN
	user.stage = 'MENUPRINCIPAL';
	user.menuStack = ['MENUPRINCIPAL'];
	await client.sendMessage(contact, menus.MENUPRINCIPAL.text);

}

module.exports = { handleMessage };
