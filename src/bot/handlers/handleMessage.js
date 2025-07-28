const { menus } = require('../../menus');
const { randomGreeting } = require('../../utils/greetings');

// Handlers individuais por departamento
const { handleOperacional } = require('./operacional');
const { handleEquipeTec } = require('./equipeTec');
const { handleFinanceiro } = require('./financeiro');
const { handleTreinamento } = require('./treinamento');

const users = new Map();

async function handleMessage(msg, client) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();
    const body = bodyRaw.toLowerCase();

    // ➤ Inicialização / reset
    let user = users.get(contact);
    if (!user || user.stage === "ENDED") {
        users.set(contact, { stage: "MAIN" });
        await client.sendMessage(contact, randomGreeting());
        await client.sendMessage(contact, menus["MAIN"].text);
        return;
    }
    user = users.get(contact);

    // ➤ Encerrar sessão
    if (body === "0" || body === "encerrar sessão") {
        await client.sendMessage(contact, "Até a próxima!");
        user.stage = "ENDED";
        return;
    }

    // ➤ Voltar
    if ((body === "00" || body === "voltar") && user.lastMenuStage) {
        user.stage = user.lastMenuStage;
        await client.sendMessage(contact, menus[user.stage].text);
        return;
    }

    // ➤ Roteamento geral por departamento / fluxo de CHAMADO
    // Note que CHAMADO engloba todo o questionário da equipe técnica
    if (
        user.stage.startsWith("OPERACIONAL") ||
        user.stage === "CHAMADO" ||
        (user.stage === "EQUIPE_TEC" && bodyRaw === "2")
    ) {
        await handleEquipeTec(msg, client, user, users);         // chama as etapas da equipe técnica
        return;
    }

    if (user.stage.startsWith("FINANCEIRO")) {
        await handleFinanceiro(msg, client, user, users);
        return;
    }

    if (user.stage.startsWith("TREINAMENTO")) {
        await handleTreinamento(msg, client, user, users);
        return;
    }






    // ➤ Navegação de menus padrão
    const stage = menus[user.stage];
    if (!stage) {
        user.stage = "MAIN";
        await client.sendMessage(contact, menus["MAIN"].text);
        return;
    }

    const option = stage.options?.[bodyRaw];
    if (!option) {
        await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
        await client.sendMessage(contact, stage.text);
        return;
    }
    if (typeof option === "string" && menus[option]) {
        user.lastMenuStage = user.stage;
        user.stage = option;
        await client.sendMessage(contact, menus[option].text);
    } else {
        await client.sendMessage(contact, option);
        user.lastMenuStage = user.stage;
        user.stage = "AWAITING_DECISION";
        await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
    }
}

module.exports = { handleMessage };
