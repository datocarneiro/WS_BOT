const { menus } = require('../../menus');
const { randomGreeting } = require('../../utils/greetings');
const { handleOperacional } = require('./operacional');
const { handleFinanceiro } = require('./financeiro');
const { handleEquipeTec } = require('./equipeTec');
const { handleTreinamento } = require('./treinamento');

const users = new Map();

// Função auxiliar para obter o texto correto do menu com base no stage
function getMenuTextForStage(stage) {
  if (menus[stage]) return menus[stage].text;
  if (stage.startsWith('TREINAMENTO')) return menus.TREINAMENTO.text;
  if (stage.startsWith('EQUIPE_TEC')) return menus.EQUIPE_TEC.text;
  if (stage.startsWith('FINANCEIRO')) return menus.FINANCEIRO.text;
  if (stage.startsWith('OPERACIONAL')) return menus.OPERACIONAL.text;
  return menus.MAIN.text;
}

async function handleMessage(msg, client) {
  const contact = msg.from;
  const bodyRaw = msg.body.trim();
  const body = bodyRaw.toLowerCase();

  let user = users.get(contact);
  if (!user || user.stage === 'ENDED') {
    users.set(contact, { stage: 'MAIN', menuStack: ['MAIN'] });
    await client.sendMessage(contact, randomGreeting());
    return client.sendMessage(contact, menus.MAIN.text);
  }
  user = users.get(contact);

  // Encerrar sessão
  if (body === '00' || body === 'encerrar sessão') {
    user.stage = 'ENDED';
    user.menuStack = [];
    return client.sendMessage(contact, 'Até a próxima!');
  }

  // Voltar para menu anterior
  if (body === '0' || body === 'voltar') {
    if (user.menuStack.length > 1) user.menuStack.pop();
    const previous = user.menuStack.at(-1);
    user.stage = previous;
    console.log('Voltar para:', previous, 'menuStack:', user.menuStack); // DEBUG
    const text = getMenuTextForStage(previous);
    return client.sendMessage(contact, text);
  }

  // Menu principal
  if (user.stage === 'MAIN') {
    const choice = menus.MAIN.options[bodyRaw];
    if (!choice) {
      await client.sendMessage(contact, '❌ Opção inválida.');
      return client.sendMessage(contact, menus.MAIN.text);
    }
    user.stage = choice;
    user.menuStack.push(choice);
    console.log('Após push:', user.menuStack);
    const text = getMenuTextForStage(choice);
    return client.sendMessage(contact, text);
  }

  // Encaminha para o handler adequado
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

  // Fallback: volta ao MAIN
  user.stage = 'MAIN';
  user.menuStack = ['MAIN'];
  return client.sendMessage(contact, menus.MAIN.text);
}

module.exports = { handleMessage };

