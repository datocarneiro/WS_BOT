const { menus } = require('../../menus');
const { randomGreeting } = require('../../utils/greetings');
const { handlePedidoERP } = require("./actions/operacional");

const users = new Map();

async function handleMessage(msg, client) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();
    const body = bodyRaw.toLowerCase();

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

    // ➤ Voltar (menu anterior)
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

    let option = null;

    if (!stage.input) {
        option = stage.options[bodyRaw];

        if (!option) {
            await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
            await client.sendMessage(contact, stage.text);
            return;
        }
    }

    // ➤ Entrada de dados (ex: pedido)
    if (stage.input) {
        if (user.stage === "OPERACIONAL_PEDIDO_INPUT") {
            await handlePedidoERP(client, contact, bodyRaw);
            user.lastMenuStage = user.stage;
            user.stage = "AWAITING_DECISION";
            await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
            return;
        }
    }

    if (typeof option === "string" && menus[option]) {
        user.lastMenuStage = user.stage;
        user.stage = option;
        await client.sendMessage(contact, menus[option].text);
    } else if (option) {
        await client.sendMessage(contact, option);
        user.lastMenuStage = user.stage;
        user.stage = "AWAITING_DECISION";
        await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
    }
}

module.exports = { handleMessage };
