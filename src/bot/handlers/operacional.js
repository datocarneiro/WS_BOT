// src/bot/handlers/operacional.js

const { menus } = require('../../menus');
const fetchPedido = require('../utils/getPedido');

async function handleOperacional(msg, client, user, users) {
  const contact = msg.from;
  const bodyRaw = msg.body.trim();
  const body = bodyRaw.toLowerCase();

  // Garante que o menu correto está no topo da pilha
  if (user.menuStack.at(-1) !== 'OPERACIONAL') {
    user.menuStack.push('OPERACIONAL');
    console.log('Forçado push OPERACIONAL. menuStack:', user.menuStack);
  }

  // Encerrar sessão
  if (body === '00' || body === 'encerrar sessão') {
    user.stage = 'ENDED';
    user.menuStack = [];
    return client.sendMessage(contact, 'Até a próxima!');
  }

  // Voltar ao menu anterior
  if (body === '0' || body === 'voltar') {
    if (user.menuStack.length > 1) user.menuStack.pop();
    const previous = user.menuStack.at(-1);
    user.stage = previous;
    console.log('Voltar para:', previous, 'menuStack:', user.menuStack);
    const text = menus[previous]?.text || menus.OPERACIONAL.text;
    return client.sendMessage(contact, text);
  }

  // ─── Fluxo de Operacional ───
  switch (user.stage) {
    // A) Usuário acabou de entrar em OPERACIONAL: processa a escolha
    case 'OPERACIONAL': {
      const nextStage = menus.OPERACIONAL.options[bodyRaw];
      if (!nextStage) {
        await client.sendMessage(contact, '❌ Opção inválida.');
        return client.sendMessage(contact, menus.OPERACIONAL.text);
      }
      // avança para o subfluxo
      user.lastMenuStage = 'OPERACIONAL';
      user.stage         = nextStage;
      user.menuStack.push(nextStage);  // ← ADICIONE ISTO
      return client.sendMessage(contact, menus[nextStage].text);
    }

    // B) Entrada de número de pedido
    case 'OPERACIONAL_PEDIDO_INPUT': {
      const pedido = bodyRaw;
      await client.sendMessage(contact, `🔎 Consultando pedido${pedido}, aguarde enquanto processamos...`);
      try {
        const dados = await fetchPedido(pedido);
        if (!dados) {
          await client.sendMessage(contact, `⚠️ Pedido ${pedido} não encontrado.`);
        } else if (dados.erro) {
          await client.sendMessage(contact, `⚠️ Erro: ${dados.erro}`);
        } else {
          const nomeTransporte = dados.transportes?.[0]?.nome || 'Não informado';
          const nomeDest       = dados.destinatario?.nome       || 'Não informado';
          const razaoSocial    = dados.destinatario?.razaoSocial || 'Não informado';
          const statusDesc     = dados.status?.descricao        || 'Não informado';

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
    }

    // C) Entrada de SKU para saldo
    case 'OPERACIONAL_SALDO_INPUT': {
      const sku = bodyRaw;
      await client.sendMessage(contact, `🔎 Consultando saldo do SKU ${sku}...`);
      // TODO: fetchSaldo
      await client.sendMessage(contact, `💰 Saldo disponível para SKU ${sku}: 123 unidades.`);
      ;
    }

    // D) Respostas diretas (sem input extra)
    default: {
      const direct = menus[user.stage];
      if (direct && direct.next === 'OPERACIONAL') {
        await client.sendMessage(contact, direct.text);
        user.stage = 'OPERACIONAL';
        return client.sendMessage(contact, menus.OPERACIONAL.text);
      }
    }
  }
}

module.exports = { handleOperacional };
