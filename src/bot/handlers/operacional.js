const { menus } = require('../../menus');
const { pushMenu, popMenu, getCurrentMenuText } = require('../utils/navigation');
const fetchPedido = require('../utils/getPedido');

// Texto de navegação padrão
const NAVIGATION_TEXT = `

📲 *Navegação:*
0 - Voltar
00 - Encerrar sessão`;

async function handleOperacional(msg, client, user, users) {
  const contact = msg.from;
  const bodyRaw = msg.body.trim();
  const body = bodyRaw.toLowerCase();

  // Ao entrar em Operacional, empilha e exibe menu
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
      return;
    }

    case 'OPERACIONAL_SALDO_INPUT': {
      const sku = bodyRaw;
      await client.sendMessage(contact, `🔎 Consultando saldo do SKU ${sku}...`);
      // TODO: implementar fetchSaldo
      await client.sendMessage(contact, `💰 Saldo disponível para SKU ${sku}: 123 unidades.`);
      await client.sendMessage(contact, NAVIGATION_TEXT);
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

module.exports = { handleOperacional };
