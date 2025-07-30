const { menus } = require('../../menus');
const { pushMenu, popMenu, getCurrentMenuText } = require('../utils/navigation');

async function handleTreinamento(msg, client, user, users) {
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

  // Processar opção de treinamento
  const resp = menus.TREINAMENTO.getRandomResponse(bodyRaw);
  if (!resp) {
    await client.sendMessage(contact, '❌ Opção inválida.');
    return client.sendMessage(contact, menus.TREINAMENTO.text);
  }

  // Envia resposta e opções de navegação
  await client.sendMessage(contact, resp);
  const nav = `\n\n📲 *Navegação:*\n0 - Voltar\n00 - Encerrar sessão`;
  await client.sendMessage(contact, nav);
}

module.exports = { handleTreinamento };
