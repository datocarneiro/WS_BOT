// src/bot/handlers/handleMessage.js

const { menus } = require('../../menus');
const { randomGreeting } = require('../../utils/greetings');
const { handleOperacional } = require('./operacional');
const { handleFinanceiro } = require('./financeiro');
const { handleEquipeTec } = require('./equipeTec');
const { handleTreinamento } = require('./treinamento');
const { popMenu, pushMenu, getCurrentMenuText } = require('../utils/navigation');

const users = new Map();

async function handleMessage(msg, client) {
  const contact = msg.from;
  const bodyRaw = msg.body.trim();
  const body = bodyRaw.toLowerCase();

  let user = users.get(contact);
  if (!user || user.stage === 'ENDED') {
    users.set(contact, { stage: 'MAIN', menuStack: ['MAIN'] });
    await client.sendMessage(contact, randomGreeting());
    await client.sendMessage(contact, menus.MAIN.text);
    return;
  }
  user = users.get(contact);

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

  // Menu Principal
  if (user.stage === 'MAIN') {
    const choice = menus.MAIN.options[bodyRaw];
    if (!choice) {
      await client.sendMessage(contact, '❌ Opção inválida.');
      await client.sendMessage(contact, menus.MAIN.text);
      return;
    }
    pushMenu(user, choice);
    await client.sendMessage(contact, getCurrentMenuText(user));
    return;
  }

  // Delegar aos handlers específicos
  if (user.stage.startsWith('OPERACIONAL')) {
    return handleOperacional(msg, client, user, users);
  }
  if (user.stage.startsWith('FINANCEIRO')) {
    return handleFinanceiro(msg, client, user, users);
  }
  if (user.stage.startsWith('EQUIPE_TEC') || user.stage === 'CHAMADO') {
    return handleEquipeTec(msg, client, user, users);
  }
  if (user.stage.startsWith('TREINAMENTO')) {
    return handleTreinamento(msg, client, user, users);
  }

  // Fallback: garante retorno ao MAIN
  user.stage = 'MAIN';
  user.menuStack = ['MAIN'];
  await client.sendMessage(contact, menus.MAIN.text);
}

module.exports = { handleMessage };
