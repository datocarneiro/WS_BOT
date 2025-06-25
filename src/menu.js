const menus = {
  MAIN: {
    text: `Escolha o departamento:
1 - Operacional
2 - Financeiro
3 - Equipe Técnica
4 - Treinamento`,
    options: {
      "1": "OPERACIONAL",
      "2": "FINANCEIRO",
      "3": "EQUIPE_TEC",
      "4": "TREINAMENTO"
    }
  },
  OPERACIONAL: {
    text: `Departamento Operacional:
1 - Consultar Pedido
2 - Consultar Recebimento
3 - Voltar`,
    options: {
      "1": "OPERACIONAL_PEDIDO_INPUT",
      "2": "📦 Verificando recebimento...",
      "3": "MAIN"
    }
  },
  OPERACIONAL_PEDIDO_INPUT: {
    text: `🔍 Informe o número do pedido ERP:`,
    input: true,
    next: "MAIN"
  },
  FINANCEIRO: {
    text: `Departamento Financeiro:
1 - Solicitar fatura
2 - Voltar`,
    options: {
      "1": "💰 Solicitação de fatura recebida. Em breve entraremos em contato.",
      "2": "MAIN"
    }
  },
  EQUIPE_TEC: {
    text: `Equipe Técnica:
1 - Assunto 1 (texto técnico)
2 - Assunto 2 (texto técnico)
3 - Voltar`,
    options: {
      "1": "👨‍🔧 Encaminhando para técnico - assunto 1...",
      "2": "🛠 Encaminhando para técnico - assunto 2...",
      "3": "MAIN"
    }
  },
  TREINAMENTO: {
    text: `Treinamento:
1 - Inserir anexos de documentos
2 - Criar ordem manual
3 - Voltar`,
    options: {
      "1": "📎 Envie os anexos diretamente por aqui.",
      "2": "📋 Criando ordem manual... por favor aguarde.",
      "3": "MAIN"
    }
  }
};

module.exports = { menus };
