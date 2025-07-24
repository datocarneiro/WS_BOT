module.exports = {
  OPERACIONAL: {
    text: `Departamento Operacional:
1 - Consultar Pedido
2 - Consultar Recebimento
00 - Voltar
0 - Encerrar sessão`,
    options: {
      "1": "OPERACIONAL_PEDIDO_INPUT",
      "2": "📦 Verificando recebimento...",
      "3": "Menu Principal",
      "0": "LOGOUT"
    }
  },
  OPERACIONAL_PEDIDO_INPUT: {
    text: `🔍 Informe o número do pedido ERP:`,
    input: true,
    next: "Menu Principal"
  }
};
