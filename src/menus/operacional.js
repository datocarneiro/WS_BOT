module.exports = {
	OPERACIONAL: {
	text: `🏢 Departamento Comercial/ Atendimento:
	1 - 📦 Consultar Pedido
	2 - 🔎 Consulta de Saldo
	3 - 📥 Consultar Recebimento
	4 - ⏰ Horario de Recebimento
	5 - 🚚 Horario de expedição
	6 - 🕗 Horario de funcionamento da empresa
	7 - 🤝 Falar com um atendente
	
	0 - ⬅️ Voltar
	# - 🛑 Encerrar`,

	options: {
	"1": "OPERACIONAL_PEDIDO_INPUT",
	"2": "SKU_INPUT",
	"3": "RECEBIMENTO_INPUT",
	"4": "Nosso horário de Recebimento de mercadorias: das 8h às 15h",
	"5": "Nosso horário de Expedição de pedidos: das 13h às 17h30",
	"6": "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h",
	}
	},
	
	OPERACIONAL_PEDIDO_INPUT: {
		text: `🔍 Informe o número do pedido/numero de origem:`,
		input: true,
	},
	
	SKU_INPUT: {
		text: `🔍 Informe o número do SKU do produto (código identificador):`,
		input: true,
		next: "Menu Principal"
	},

	RECEBIMENTO_INPUT: {
		text: `🔍 Informe o código RB`,
		input: true,
		next: "Menu Principal"
	},
};
