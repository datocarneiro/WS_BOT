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
            // ➤ Todos os dados coletados, envia ao grupo
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

            await client.sendMessage(contact, menus["EQUIPE_TEC"].text);
        }

        return;
    }
}

module.exports = { handleEquipeTec };  // ✅ CORRETO

