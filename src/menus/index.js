const main = require("./main");
const operacional = require("./operacional");
const financeiro = require("./financeiro");
const equipeTec = require("./equipeTec");
const treinamento = require("./treinamento");

const menus = {
  ...main,
  ...operacional,
  ...financeiro,
  ...equipeTec,
  ...treinamento
};

module.exports = { menus };
