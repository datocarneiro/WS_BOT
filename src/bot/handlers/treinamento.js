const { menus } = require('../../menus');

async function handleTreinamento(msg, client, user, users) {
  const contact = msg.from;
  const bodyRaw = msg.body.trim();
  const body = bodyRaw.toLowerCase();

  // Garante que o menu está na pilha ao entrar em treinamento
  if (user.menuStack.at(-1) !== 'TREINAMENTO') {
    user.menuStack.push('TREINAMENTO');
    console.log('Forçado push TREINAMENTO. menuStack:', user.menuStack);
  }

  // Encerrar sessão
  if (body === '00' || body === 'encerrar sessão') {
    user.stage = 'ENDED';
    user.menuStack = [];
    return client.sendMessage(contact, 'Até a próxima!');
  }

  // Voltar ao menu anterior (MAIN ou outro)
  if (body === '0' || body === 'voltar') {
    if (user.menuStack.length > 1) {
      console.log('menuStack É MAIOR QUE 1');
      user.menuStack.pop(); // Remove o menu atual (TREINAMENTO)
      const previous = user.menuStack.at(-1) || 'MAIN'; // Novo topo da pilha

      user.stage = previous;
      console.log('Voltar para:', previous, 'menuStack:', user.menuStack);

      const previousMenuText = menus[previous].text;

      return client.sendMessage(contact, previousMenuText + opcoesNavegacao);
    } else {
      // Se for o único item na pilha, volta para o MAIN
      user.menuStack = ['MAIN'];
      user.stage = 'MAIN';
      return client.sendMessage(contact, menus.MAIN.text);
    }
  }

  
  // Selecione uma opção válida de treinamento
  const resp = menus.TREINAMENTO.getRandomResponse(bodyRaw);
  if (!resp) {
    await client.sendMessage(contact, '❌ Opção inválida.');
    return client.sendMessage(contact, menus.TREINAMENTO.text);
  }

  // Envia resposta + opções de navegação
  await client.sendMessage(contact, resp);
  await client.sendMessage(contact);
}

module.exports = { handleTreinamento };
