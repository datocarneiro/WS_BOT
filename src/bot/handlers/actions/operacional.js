const { menus } = require("../../../menus");
const fetchPedido = require("../../utils/getPedido");

async function handlePedidoERP(client, contact, body) {
  const pedido = body;
  await client.sendMessage(contact, `🔎 Consultando pedido ERP ${pedido}...`);

  try {
    const dados = await fetchPedido(pedido); // corrigido para usar fetchPedido, que é a função exportada

    if (!dados) {
      await client.sendMessage(contact, `⚠️ Pedido ${pedido} não encontrado.`);
    } else if (dados.erro) {
      await client.sendMessage(contact, `⚠️ Erro: ${dados.erro}`);
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

  await client.sendMessage(contact, menus["MAIN"].text);
}

module.exports = { handlePedidoERP };
