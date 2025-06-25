const fetch = require("node-fetch");
const { menus } = require("./menu");
const { randomGreeting } = require("./utils");

const users = new Map();

async function handleMessage(msg, client) {
  const contact = msg.from;
  const body = msg.body.trim();

  if (!users.has(contact)) {
    users.set(contact, { stage: "MAIN" });
    await client.sendMessage(contact, randomGreeting());
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

  if (stage.input) {
    if (user.stage === "OPERACIONAL_PEDIDO_INPUT") {
      const pedido = body;
      await client.sendMessage(contact, `🔎 Consultando pedido ERP ${pedido}...`);

      try {
        const response = await fetch('https://amplo.eship.com.br/v3/?api=&funcao=webServiceGetOrdem', {
          method: 'POST',
          headers: {
            'Api': '2dc02cfa7c2c7817e1b619cbcd14f7b0',
            'Content-Type': 'application/json',
            'Cookie': 'amplo=3rssk9gva7asg82g4objrqf1vh'
          },
          body: JSON.stringify({ ordem: pedido })
        });

        const result = await response.json();

        const dados = result?.corpo?.body?.dados?.[0];
        if (!dados) {
          await client.sendMessage(contact, `⚠️ Pedido ${pedido} não encontrado.`);
        } else {
          const nomeTransporte = dados.transportes?.[0]?.nome || "Não informado";
          const nomeDestinatario = dados.destinatario?.nome || "Não informado";
          const razaoSocialDestinatario = dados.destinatario?.razaoSocial || "Não informado";
          const statusDescricao = dados.status?.descricao || "Não informado";

          const mensagem = `📦 *Detalhes do Pedido ${pedido}*:

🚚 *Transporte:* ${nomeTransporte}
👤 *Destinatário:* ${nomeDestinatario}
🏢 *Razão Social:* ${razaoSocialDestinatario}
📋 *Status:* ${statusDescricao}`;

          await client.sendMessage(contact, mensagem);
        }

      } catch (error) {
        console.error("Erro ao consultar API:", error);
        await client.sendMessage(contact, "❌ Erro ao consultar o pedido. Tente novamente mais tarde.");
      }

      user.stage = stage.next;
      await client.sendMessage(contact, menus[user.stage].text);
      return;
    }
  }

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
    await client.sendMessage(contact, option);
    user.stage = "MAIN";
    await client.sendMessage(contact, menus["MAIN"].text);
  }
}

module.exports = { handleMessage };
