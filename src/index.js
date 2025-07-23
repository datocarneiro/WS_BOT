const path = require("path");
const fs = require("fs");

const main = require("./menus/main");

// Carrega todos os arquivos de menu da pasta 'menus', exceto "main.js"
const menusDir = path.join(__dirname, "menus");
const files = fs.readdirSync(menusDir).filter(
  (file) => file !== "main.js" && file.endsWith(".js")
);

const menus = {
  ...main
};

// Adiciona automaticamente a opção "Voltar" nos submenus
files.forEach((file) => {
  const menu = require(path.join(menusDir, file));
  const key = Object.keys(menu)[0];

  // Adiciona a opção "Voltar"
  menus[key] = {
    ...menu[key],
    text: menu[key].text + `\n0 - Voltar`,
    options: {
      ...menu[key].options,
      "0": "MenuPrincipal"  // usar a chave correta do menu principal
    }
  };
});

module.exports = { menus };
