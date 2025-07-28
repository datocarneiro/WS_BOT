// src/menus/treinamento.js

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
00 - Voltar
0 - Encerrar`,

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
00 - Voltar
0 - Encerrar`,

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
00 - Voltar
0 - Encerrar`
  ],

  // ---- VARIAÇÕES DAS RESPOSTAS ----
  options: {
    "1": [
      "Descubra as funcionalidades principais do eShip: https://www.youtube.com/watch?v=d_m_duoQ5ZY",
      "Introdução completa ao eShip e seus recursos: https://www.youtube.com/watch?v=d_m_duoQ5ZY",
      "Primeiros passos para entender o eShip: https://www.youtube.com/watch?v=d_m_duoQ5ZY"
    ],
    // ... demais opções ...
  },

  // ---- VARIÁVEIS INTERNAS ----
  _textIndex: 0,
  _responseIndexes: {},

  // ---- FUNÇÕES AUXILIARES ----
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // Função para recuperar texto dependendo de contexts
  getText() {
    // retorna o array completo se necessário ou um único embaralhado
    return this._getRandomText();
  },

  // Retorna uma variação do menu sem repetir até passar por todas
  _getRandomText() {
    if (!this._shuffled || this._textIndex >= this.texts.length) {
      this._shuffled = this._shuffleArray([...this.texts]);
      this._textIndex = 0;
    }
    return this._shuffled[this._textIndex++];
  },

  // Retorna variação para resposta
  getRandomResponse(num) {
    if (!this._responseIndexes[num]) {
      this._responseIndexes[num] = {
        shuffled: this._shuffleArray([...this.options[num]]),
        idx: 0
      };
    }
    const entry = this._responseIndexes[num];
    if (entry.idx >= entry.shuffled.length) {
      entry.shuffled = this._shuffleArray([...this.options[num]]);
      entry.idx = 0;
    }
    return entry.shuffled[entry.idx++];
  }
};

// Sincroniza `text` com `texts` para compatibilidade com handleMessage
Object.defineProperty(TREINAMENTO, 'text', {
  get() {
    return this.getText();
  }
});

module.exports = { TREINAMENTO };
