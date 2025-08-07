const menuPricipal = require("./menuPricipal");
const operacional = require("./operacional");
const financeiro = require("./financeiro");
const treinamento = require("./treinamento");
const equipeTec = require("./equipeTec");

const menus = {
	...menuPricipal,
	...treinamento,
	...financeiro,
	...operacional,
	...equipeTec,
};

module.exports = { menus };
