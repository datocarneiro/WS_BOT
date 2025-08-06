const { menus } = require("../../menus/gerirMenus");

async function tratarMensagemFinanceiro(msg, client, user, users) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();

    if (body === '00' || body === 'voltar') {
        if (user.menuStack.length > 1) user.menuStack.pop();  // mantém histórico correto
        const prev = user.menuStack.at(-1) || 'MAIN';
        user.stage = prev;
        return client.sendMessage(contact, menus[prev].text);
    }


    if (user.stage === "FINANCEIRO" && bodyRaw === "1") {
        await client.sendMessage(contact, "💰 Solicitação de fatura recebida. Em breve entraremos em contato.");
        user.lastMenuStage = user.stage;
        user.stage = "AWAITING_DECISION";
        await client.sendMessage(contact, "Escolha uma opção:\n00 - Voltar\n0 - Encerrar sessão");
        return;
    }

    // Fallback
    await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
    await client.sendMessage(contact, menus["FINANCEIRO"].text);
}

module.exports = { tratarMensagemFinanceiro };
