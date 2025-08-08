module.exports = {
	OPERACIONAL: {
	text: `🏢 *Departamento Comercial/ Atendimento:*
	1 – 📦  Consultar Pedido
	2 – 🔎  Consulta de Saldo
	3 – 📥  Consultar Recebimento
	4 – ⏰  Horário de Recebimento (Doca)
	5 – 🚚  Horário de Expedição (Doca)
	6 – 🕗  Horário de Funcionamento
	* – 🤝  Solicitar atendimento
	0 - ⬅️  Voltar
	# - 🛑  Encerrar`,

	options: {
		"1": "OPERACIONAL_PEDIDO_INPUT",
		"2": "OPERACIONAL_SALDO_INPUT",
		"3": "OPERACIONAL_RECEBIMENTO_INPUT",
		"4": "OPERACIONAL_HORARIO_RECEBIMENTO",
		"5": "OPERACIONAL_HORARIO_EXPEDICAO",
		"6": "OPERACIONAL_HORARIO_FUNCIONAMENTO",
		"*": "OPERACIONAL_SOLICITAR_ATENDIMENTO"
		}
	},

	// entradas que esperam input do usuário
	OPERACIONAL_PEDIDO_INPUT: {
		text: `🔍 Informe o número do pedido/numero de origem:`,
		input: true
	},

	OPERACIONAL_SALDO_INPUT: {
		text: `🔍 Informe o número do SKU do produto (código identificador):`,
		input: true,
		next: "OPERACIONAL"
	},

	OPERACIONAL_RECEBIMENTO_INPUT: {
		text: `🔍 Informe o código RB:`,
		input: true,
		next: "OPERACIONAL"
	},

	// respostas estáticas que voltam ao menu
	OPERACIONAL_HORARIO_RECEBIMENTO: {
		text: `⏰ Nosso horário de Recebimento de mercadorias é das 8h às 15h.`,
		next: "OPERACIONAL"
	},

	OPERACIONAL_HORARIO_EXPEDICAO: {
		text: `🚚 Nosso horário de Expedição de pedidos é das 13h às 17h30.`,
		next: "OPERACIONAL"
	},

	OPERACIONAL_HORARIO_FUNCIONAMENTO: {
		text: `🕗 Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h.`,
		next: "OPERACIONAL"
	},

	OPERACIONAL_SOLICITAR_ATENDIMENTO: {
		next: "OPERACIONAL"
	}
};



// 1 - 📦 Consultar Pedido
// 2 - 🔎 Consulta de Saldo
// 3 - 📥 Consultar Recebimento
// 4 - ⏰ Horário de Recebimento
// 5 - 🚚 Horário de Expedição
// 6 - 🕗 Horário de Funcionamento
// 7 - 🤝 Falar com um atendente

// [1] - Consultar Pedido
// [2] - Consulta de Saldo
// [3] - Consultar Recebimento
// [4] - Horário de Recebimento
// [5] - Horário de Expedição
// [6] - Horário de Funcionamento
// [7] - Falar com um atendente