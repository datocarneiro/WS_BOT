// src/bot/utils/navigation.js

const { menus } = require('../../menus');

function pushMenu(user, stage) {
  if (user.menuStack.at(-1) !== stage) {
    user.menuStack.push(stage);
  }
  user.stage = stage;
}

function popMenu(user) {
  if (user.menuStack.length > 1) {
    user.menuStack.pop();
  }
  user.stage = user.menuStack.at(-1) || 'MAIN';
}

// retorna o texto do menu baseado no user.stage
function getCurrentMenuText(user) {
  const s = user.stage;
  if (menus[s]?.text) return menus[s].text;
  if (s.startsWith('TREINAMENTO')) return menus.TREINAMENTO.text;
  if (s.startsWith('EQUIPE_TEC'))    return menus.EQUIPE_TEC.text;
  if (s.startsWith('FINANCEIRO'))    return menus.FINANCEIRO.text;
  if (s.startsWith('OPERACIONAL'))   return menus.OPERACIONAL.text;
  return menus.MAIN.text;
}

module.exports = { pushMenu, popMenu, getCurrentMenuText };
