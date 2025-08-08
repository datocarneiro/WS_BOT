const { menus } = require("../../menus/gerirMenus");
const { iniciarFluxoAtendimento } = require("./atendimento"); 
require('dotenv').config();

const GRUPO_ID_EQUIPETEC = process.env.GRUPO_ID_EQUIPETEC;

async function tratarMensagemEquipeTec(msg, client, user, users) {
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

      // tenta delegar ao fluxo de atendimento (retorno true => já foi tratado)
    const atendimentoOpts = {
        grupoID: GRUPO_ID_EQUIPETEC,
        retornoMenu: 'EQUIPE_TEC',
        trigger: '*',
        endSessionAfterCreate: true // <- importante: encerra sessão após criar o chamado
    };
    const atendimentoTratado = await iniciarFluxoAtendimento(client, contact, user, bodyRaw, atendimentoOpts);
    if (atendimentoTratado) {
        // o módulo já respondeu e encerrou a sessão (se endSessionAfterCreate = true)
        return;
    }

    // Menu principal da EQUIPE_TEC
    if (user.stage === 'EQUIPE_TEC') {
        await client.sendMessage(contact, menus["EQUIPE_TEC"].text);
        return;
    }
}

module.exports = { tratarMensagemEquipeTec };
