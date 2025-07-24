const { menus } = require('../../menus');
const greetings = require('../../utils/greetings');
const { handlePedidoERP } = require("./actions/operacional");

const users = new Map();

async function handleMessage(msg, client) {
  const contact = msg.from;
  const body = msg.body.trim();

  if (!users.has(contact)) {
    users.set(contact, { stage: "MAIN" });
    await client.sendMessage(contact, greetings.randomGreeting());
    await client.sendMessage(contact, menus["MAIN"].text);
    return;
  }

  const user = users.get(contact);
  const stage = menus[user.stage];

  if (!stage) {
    users.set(contact, { stage: "MAIN" });
    await client.sendMessage(contact, menus["MAIN"].text);
    return;
  }

  // 🔍 Entrada de dados
  if (stage.input) {
    if (user.stage === "OPERACIONAL_PEDIDO_INPUT") {
      await handlePedidoERP(client, contact, body);
      user.stage = stage.next;
      return;
    }
  }

  // 🔁 Opções
  const option = stage.options[body];

  if (!option) {
    await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
    await client.sendMessage(contact, stage.text);
    return;
  }

  if (typeof option === "string" && menus[option]) {
    user.stage = option;
    await client.sendMessage(contact, menus[option].text);
  } else {
    await client.sendMessage(contact, option); // Resposta final
    user.stage = "MAIN";
    await client.sendMessage(contact, menus["MAIN"].text);
  }
}

module.exports = { handleMessage };
