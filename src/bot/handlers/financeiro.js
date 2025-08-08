const { menus } = require("../../menus/gerirMenus");
const { iniciarFluxoAtendimento } = require("./atendimento"); 
require('dotenv').config();

const GRUPO_ID_FINANCEIRO= process.env.GRUPO_ID_FINANCEIRO;

async function tratarMensagemFinanceiro(msg, client, user, users) {
    const contact = msg.from;
    const bodyRaw = msg.body.trim();
    const body = bodyRaw.toLowerCase();

	// Encerrar sessão
	if (body === '#' || body === 'encerrar sessão') {
		console.log('>> comando de encerrar sessão');
		user.stage = 'ENDED';
		user.menuStack = [];
		await client.sendMessage(contact, 'Até a próxima!');
		return;
	}

	// Voltar para menu anterior
	if (body === '0' || body === 'voltar') {
		console.log('>> comando de voltar');
		popMenu(user);
		console.log('user.stage após popMenu:', user.stage);
		await client.sendMessage(contact, getCurrentMenuText(user));
		return;
	}



    // tenta delegar ao fluxo de atendimento (retorno true => já foi tratado)
    const atendimentoOpts = {
        grupoID: GRUPO_ID_FINANCEIRO,
        retornoMenu: 'FINANCEIRO',
        trigger: '*',
        endSessionAfterCreate: true // <- importante: encerra sessão após criar o chamado
    };
   
    // Se usuário escolher opção 1 ou 2 no menu FINANCEIRO -> iniciar fluxo
    if (user.stage === "FINANCEIRO" && (bodyRaw === "1" || bodyRaw === "2")) {
        // passa '*' para forçar o início (o módulo entende '*' como gatilho)
        await iniciarFluxoAtendimento(client, contact, user, '*', atendimentoOpts);
        return; // já tratado: não continue no handler
    }

    // Caso geral: delega ao módulo (inicia se bodyRaw === trigger, ou processa etapas se user.stage === 'CHAMADO')
    const atendimentoTratado = await iniciarFluxoAtendimento(client, contact, user, bodyRaw, atendimentoOpts);
    if (atendimentoTratado) return;

    // Fallback
    await client.sendMessage(contact, "❌ Opção inválida. Tente novamente.");
    await client.sendMessage(contact, menus["FINANCEIRO"].text);
}

module.exports = { tratarMensagemFinanceiro };
