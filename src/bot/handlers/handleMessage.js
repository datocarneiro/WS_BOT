const { menus } = require('../../menus');
const { randomGreeting } = require('../../utils/greetings');
const { handlePedidoERP } = require("./actions/operacional");

const users = new Map();

async function handleMessage(msg, client) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();
    const body = bodyRaw.toLowerCase(); // normaliza entrada

    let user = users.get(contact);

    // ➤ Primeira interação ou reinício após encerramento
    if (!user || user.stage === "ENDED") {
        users.set(contact, { stage: "MAIN" });
        await client.sendMessage(contact, randomGreeting());
        await client.sendMessage(contact, menus["MAIN"].text);
        return;
    }

    user = users.get(contact);

    // ➤ Encerrar sessão (soft)
    if (body === "0" || body === "encerrar sessão") {
        await client.sendMessage(contact, "Até a próxima!");
        user.stage = "ENDED";
        return;
    }

    // ➤ Voltar (menu anterior) mesmo após ações
    if ((body === "00" || body === "voltar") && user.lastMenuStage) {
        user.stage = user.lastMenuStage;
        await client.sendMessage(contact, menus[user.stage].text);
        return;
    }

    const stage = menus[user.stage];

    if (!stage) {
        user.stage = "MAIN";
        await client.sendMessage(contact, menus["MAIN"].text);
        return;
    }

    const option = stage.options[bodyRaw]; // usa original para capturar "1", "2", etc.

    // ➤ Entrada de dados (ex: pedido)
    if (stage.input) {
        if (user.stage === "OPERACIONAL_PEDIDO_INPUT") {
            await handlePedidoERP(client, contact, bodyRaw);
            user.lastMenuStage = user.stage;  // guarda o menu de origem
            user.stage = "AWAITING_DECISION";
            await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
            return;
        }
    }

    // ➤ Opção inválida
    if (!option) {
        await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
        await client.sendMessage(contact, stage.text);
        return;
    }

    // ➤ Navegação: foi para outro menu
    if (typeof option === "string" && menus[option]) {
        user.lastMenuStage = user.stage;  // salva onde estava
        user.stage = option;
        await client.sendMessage(contact, menus[option].text);
    } 
    // ➤ Ação final (exibe link/resposta)
    else {
        await client.sendMessage(contact, option);
        user.lastMenuStage = user.stage;  // guarda para voltar
        user.stage = "AWAITING_DECISION";
        await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
    }
}

module.exports = { handleMessage };
