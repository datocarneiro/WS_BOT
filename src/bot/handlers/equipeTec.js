const { menus } = require("../../menus");

// ID do grupo de suporte técnico
const grupoID = '120363418165776990@g.us';

// Etapas do questionário
const etapasChamado = [
    { key: 'empresa', pergunta: "Informe o nome da empresa:" },
    { key: 'usuario', pergunta: "Informe o nome do usuário:" },
    { key: 'titulo', pergunta: "Informe o título do chamado:" },
    { key: 'descricao', pergunta: "Descreva a situação detalhadamente:" }
];

async function handleEquipeTec(msg, client, user, users) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();
    const body = bodyRaw.toLowerCase();

    // Garante que estamos na pilha correta
    if (user.menuStack.at(-1) !== 'EQUIPE_TEC') {
        user.menuStack.push('EQUIPE_TEC');
        console.log('Forçado push EQUIPE_TEC. menuStack:', user.menuStack);
    }

    // Encerrar sessão
    if (body === '00' || body === 'encerrar sessão') {
        user.stage = 'ENDED';
        user.menuStack = [];
        return client.sendMessage(contact, 'Até a próxima!');
    }

    // Voltar ao menu anterior (MAIN ou outro)
    if (body === '0' || body === 'voltar') {
        if (user.menuStack.length > 1) user.menuStack.pop();
        const previous = user.menuStack.at(-1);
        user.stage = previous;
        console.log('Voltar para:', previous, 'menuStack:', user.menuStack);
        const text = menus[previous]?.text || menus.EQUIPE_TEC.text;
        return client.sendMessage(contact, text);
    }



    // ➤ Início do fluxo de chamado
    if (user.stage === "EQUIPE_TEC" && bodyRaw === "2") {
        user.stage = "CHAMADO";
        user.chamadoEtapa = 0;
        user.dadosChamado = {};
        await client.sendMessage(contact, etapasChamado[0].pergunta);
        return;
    }

    // ➤ Coleta de dados (etapas do questionário)
    if (user.stage === "CHAMADO") {
        const etapaAtual = etapasChamado[user.chamadoEtapa];
        user.dadosChamado[etapaAtual.key] = bodyRaw;
        user.chamadoEtapa++;

        if (user.chamadoEtapa < etapasChamado.length) {
            const proximaEtapa = etapasChamado[user.chamadoEtapa];
            await client.sendMessage(contact, proximaEtapa.pergunta);
        } else {
            const dados = user.dadosChamado;
            const mensagemGrupo =
`📣 *Nova solicitação de atendimento recebido*
🏢 *Empresa:* ${dados.empresa}
👤 *Usuário:* ${dados.usuario}
📌 *Título:* ${dados.titulo}
📝 *Descrição:* ${dados.descricao}
📱 *Origem:* ${contact}`;

            await client.sendMessage(grupoID, mensagemGrupo);
            await client.sendMessage(contact, "✅ Sua solicitação foi enviada ao responsável. Aguarde o atendimento.");

            // Retorna ao menu EQUIPE_TEC
            user.stage = "EQUIPE_TEC";
            user.dadosChamado = null;
            user.chamadoEtapa = null;
            user.menuStack.push("EQUIPE_TEC");
            await client.sendMessage(contact, menus["EQUIPE_TEC"].text);
        }
        return;
    }

    // Menu principal da EQUIPE_TEC
    if (user.stage === 'EQUIPE_TEC') {
        await client.sendMessage(contact, menus["EQUIPE_TEC"].text);
        return;
    }
}

module.exports = { handleEquipeTec };
