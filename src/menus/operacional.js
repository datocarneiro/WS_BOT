module.exports = {
  OPERACIONAL: {
    text: `🏢 Departamento Comercial/ Atendimento:
1 - 📦 Consultar Pedido
2 - 📥 Consultar Recebimento
3 - 🕗 Horario de funcionamento da empresa
4 - ⏰ Horario de Recebimento
5 - 🚚 Horario de expedição
6 - 🔎 Consulta de Saldo
0 - Voltar`,
    options: {
      "1": "OPERACIONAL_PEDIDO_INPUT",
      "2": "📦 Verificando recebimento...",
      "3": "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h"
      "4": "Nosso horário de Recebimento de mercadorias: das 8h às 15h"
      "5": "Nosso horário de Expedição de pedidos: das 15h às 17h30"
      "6": "SKU_IMPUT"
    }
  },
  SKU_IMPUT: {
    text: `🔍 Informe o número do SKU:`,
    input: true,
    next: "Menu Principal"

  OPERACIONAL_PEDIDO_INPUT: {
    text: `🔍 Informe o número do pedido ERP:`,
    input: true,
    next: "Menu Principal"
  }
};
