const { menus } = require("../../menus");

async function handleTreinamento(msg, client, user, users) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();

    const treinamentoMenu = menus["TREINAMENTO"];

    // Retorna variação aleatória do menu
    if (user.stage === "TREINAMENTO") {
        if (treinamentoMenu.options[bodyRaw]) {
            const resposta = treinamentoMenu.getRandomResponse(bodyRaw);
            await client.sendMessage(contact, resposta);
        } else {
            await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
        }

        // Sempre retorna novo menu aleatório após resposta
        await client.sendMessage(contact, treinamentoMenu.getRandomText());
    }
}

module.exports = { handleTreinamento };
