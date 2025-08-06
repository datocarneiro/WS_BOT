// Exporta o objeto TREINAMENTO para ser usado em outro arquivo com require()
const TREINAMENTO = {
  // ---- VARIAÇÕES DO MENU ----
  // Array de variações do menu principal do treinamento
  texts: [
    `Treinamento:
1 - 🎬 Apresentação do eShip
2 - 🔑 Como fazer o Login
3 - 🔒 Como alterar a Senha
4 - ✏️ Como Editar Cadastros
5 - ➕ Como Incluir Cadastros
6 - 📋 Como Listar Ordens
7 - 📎 Como incluir Anexo na Ordem
8 - 📝 Adicionar Ordem Manual
9 - 📂 Criar Ordem por XML ou Planilha
10 - ❌ Cancelar Ordem
11 - ⚠️ Ordem com Falha
12 - 🔄 Entradas e Saídas
13 - 🏷️ Materiais - Visualização de Estoque
14 - 📦 Saldos e Estoques
15 - 📥 Recebimentos
16 - 🚚 Transporte
0 - ⬅️ Voltar
00 - 🛑 Encerrar`,

    `Selecione a dúvida do treinamento:
1 - 🎬 Apresentação do eShip
2 - 🔑 Como fazer Login
3 - 🔒 Alteração de Senha
4 - ✏️ Edição de Cadastros
5 - ➕ Inclusão de Cadastros
6 - 📋 Listagem de Ordens
7 - 📎 Anexar Arquivo na Ordem
8 - 📝 Criar Ordem Manual
9 - 📂 Gerar Ordem por XML ou Planilha
10 - ❌ Cancelamento de Ordem
11 - ⚠️ Ordem com Erro
12 - 🔄 Entradas e Saídas
13 - 🏷️ Estoque de Materiais
14 - 📦 Conferir Saldos
15 - 📥 Recebimentos
16 - 🚚 Transporte
0 - ⬅️ Voltar
00 - 🛑 Encerrar`,

    `Menu de Treinamento:
1 - 🎬 Conheça o eShip
2 - 🔑 Acesso ao Sistema (Login)
3 - 🔒 Modificar Senha
4 - ✏️ Ajustar Cadastros
5 - ➕ Novo Cadastro
6 - 📋 Verificar Ordens
7 - 📎 Adicionar Anexo
8 - 📝 Ordem Manual
9 - 📂 Importar Ordem (XML/Planilha)
10 - ❌ Excluir Ordem
11 - ⚠️ Solução de Falhas
12 - 🔄 Movimentação de Entradas e Saídas
13 - 🏷️ Estoque de Materiais
14 - 📦 Saldos do Sistema
15 - 📥 Controle de Recebimentos
16 - 🚚 Transporte
0 - ⬅️ Voltar
00 - 🛑 Encerrar`
  ],
 // ---- VARIAÇÕES DAS RESPOSTAS ----
    // Cada número (1 a 16) tem 3 frases diferentes com o mesmo link do vídeo
    options: {
      "1": [
        "Descubra as funcionalidades principais do eShip: https://www.youtube.com/watch?v=d_m_duoQ5ZY",
        "Introdução completa ao eShip e seus recursos: https://www.youtube.com/watch?v=d_m_duoQ5ZY",
        "Primeiros passos para entender o eShip: https://www.youtube.com/watch?v=d_m_duoQ5ZY"
      ],
      "2": [
        "Aprenda a fazer login rapidamente no sistema: https://www.youtube.com/watch?v=1byUDXaZLpQ",
        "Veja como acessar sua conta no eShip: https://www.youtube.com/watch?v=1byUDXaZLpQ",
        "Guia passo a passo para login: https://www.youtube.com/watch?v=1byUDXaZLpQ"
      ],
      "3": [
        "Passo a passo para alterar sua senha com segurança: https://www.youtube.com/watch?v=syKkIseeyl0",
        "Veja como redefinir a senha no eShip: https://www.youtube.com/watch?v=syKkIseeyl0",
        "Como trocar sua senha de maneira simples: https://www.youtube.com/watch?v=syKkIseeyl0"
      ],
      "4": [
        "Aprenda a editar cadastros de forma eficiente: https://www.youtube.com/watch?v=GDLS_gXvzN8",
        "Passo a passo para ajustes de cadastros no sistema: https://www.youtube.com/watch?v=GDLS_gXvzN8",
        "Veja como editar dados cadastrados no eShip: https://www.youtube.com/watch?v=GDLS_gXvzN8"
      ],
      "5": [
        "Como adicionar novos cadastros no sistema: https://www.youtube.com/watch?v=WQ-K5xsY_H8",
        "Guia rápido para incluir cadastros no eShip: https://www.youtube.com/watch?v=WQ-K5xsY_H8",
        "Aprenda a cadastrar informações de forma prática: https://www.youtube.com/watch?v=WQ-K5xsY_H8"
      ],
      "6": [
        "Veja como listar ordens de maneira eficiente: https://www.youtube.com/watch?v=GWrSPD-AwqY",
        "Passo a passo para visualizar ordens no eShip: https://www.youtube.com/watch?v=GWrSPD-AwqY",
        "Aprenda a organizar e listar ordens: https://www.youtube.com/watch?v=GWrSPD-AwqY"
      ],
      "7": [
        "Tutorial para anexar arquivos em ordens: https://www.youtube.com/watch?v=WwZIEoBrEcQ",
        "Veja como incluir anexos nas ordens: https://www.youtube.com/watch?v=WwZIEoBrEcQ",
        "Passo a passo para adicionar anexos em ordens: https://www.youtube.com/watch?v=WwZIEoBrEcQ"
      ],
      "8": [
        "Saiba como adicionar ordens manualmente: https://www.youtube.com/watch?v=7VSJxtubjJM",
        "Passo a passo para criar ordens manuais: https://www.youtube.com/watch?v=7VSJxtubjJM",
        "Criação rápida de ordens manuais no eShip: https://www.youtube.com/watch?v=7VSJxtubjJM"
      ],
      "9": [
        "Aprenda a criar ordens via XML ou planilha: https://www.youtube.com/watch?v=t_9e-QRsEtg",
        "Passo a passo para importar ordens usando XML: https://www.youtube.com/watch?v=t_9e-QRsEtg",
        "Como gerar ordens por planilha de forma rápida: https://www.youtube.com/watch?v=t_9e-QRsEtg"
      ],
      "10": [
        "Saiba como cancelar ordens com segurança: https://www.youtube.com/watch?v=PuDc69PZT6A",
        "Passo a passo para cancelar uma ordem no eShip: https://www.youtube.com/watch?v=PuDc69PZT6A",
        "Veja como anular ordens rapidamente: https://www.youtube.com/watch?v=PuDc69PZT6A"
      ],
      "11": [
        "Aprenda a lidar com ordens que apresentaram falhas: https://www.youtube.com/watch?v=kxPNBNw7WZc",
        "Passo a passo para corrigir ordens com falha: https://www.youtube.com/watch?v=kxPNBNw7WZc",
        "Como tratar ordens com erro no eShip: https://www.youtube.com/watch?v=kxPNBNw7WZc"
      ],
      "12": [
        "Veja como gerenciar entradas e saídas no sistema: https://www.youtube.com/watch?v=PRYLMPWVA0M",
        "Passo a passo para registrar entradas e saídas: https://www.youtube.com/watch?v=PRYLMPWVA0M",
        "Tutorial para controle de movimentações no eShip: https://www.youtube.com/watch?v=PRYLMPWVA0M"
      ],
      "13": [
        "Saiba como visualizar estoque de materiais: https://www.youtube.com/watch?v=gzeAUniZuhg",
        "Passo a passo para consultar materiais no eShip: https://www.youtube.com/watch?v=gzeAUniZuhg",
        "Veja como acessar o estoque atualizado: https://www.youtube.com/watch?v=gzeAUniZuhg"
      ],
      "14": [
        "Aprenda a conferir saldos e estoques rapidamente: https://www.youtube.com/watch?v=zHM4AQ7djSc",
        "Passo a passo para verificar saldo e estoque no eShip: https://www.youtube.com/watch?v=zHM4AQ7djSc",
        "Veja como analisar saldos de materiais: https://www.youtube.com/watch?v=zHM4AQ7djSc"
      ],
      "15": [
        "Guia rápido para gerenciar recebimentos: https://www.youtube.com/watch?v=l1pkH9CJ4Uo",
        "Passo a passo para registrar recebimentos no eShip: https://www.youtube.com/watch?v=l1pkH9CJ4Uo",
        "Veja como controlar recebimentos de forma prática: https://www.youtube.com/watch?v=l1pkH9CJ4Uo"
      ],
      "16": [
        "Saiba como gerenciar transporte e logística: https://www.youtube.com/watch?v=N9Ma1Sfyrf0",
        "Passo a passo para operações de transporte: https://www.youtube.com/watch?v=N9Ma1Sfyrf0",
        "Veja como organizar o transporte no eShip: https://www.youtube.com/watch?v=N9Ma1Sfyrf0"
      ]
    },


  // estados internos para sortear sem repetição
  _textIndex: 0,
  _shuffled: null,
  _responseIndexes: {},

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // getter “text” entrega um dos menus de forma randômica
  getText() {
    if (!this._shuffled || this._textIndex >= this._shuffled.length) {
      this._shuffled = this._shuffleArray([...this.texts]);
      this._textIndex = 0;
    }
    return this._shuffled[this._textIndex++];
  },

  // retorna uma resposta randomizada para a opção escolhida
  getRandomResponse(key) {
    if (!this.options[key]) return null;
    if (!this._responseIndexes[key]) {
      this._responseIndexes[key] = {
        shuffled: this._shuffleArray([...this.options[key]]),
        idx: 0
      };
    }
    const entry = this._responseIndexes[key];
    if (entry.idx >= entry.shuffled.length) {
      entry.shuffled = this._shuffleArray([...this.options[key]]);
      entry.idx = 0;
    }
    return entry.shuffled[entry.idx++];
  }
};

// expõe `text` como propriedade para compatibilidade
Object.defineProperty(TREINAMENTO, 'text', {
  get() {
    return this.getText();
  }
});

module.exports = { TREINAMENTO };