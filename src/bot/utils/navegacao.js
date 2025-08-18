// src/bot/utils/navigation.js

const { menus } = require('../../menus/gerirMenus');



/*
Atualiza user.menuStack	Adiciona o novo menu à pilha do usuário
Atualiza user.stage	Define o novo menu como "menu atual"
*/




// Navegar para um novo menu (função pushMenu)
function pushMenu(user, stage) {
  if (user.menuStack.at(-1) !== stage) {
    user.menuStack.push(stage);
  }
  user.stage = stage;
}



// Voltar ao menu anterior (função popMenu)
function popMenu(user) {
  if (user.menuStack.length > 1) {
    user.menuStack.pop();
  }
  user.stage = user.menuStack.at(-1) || 'MENUPRINCIPAL';
}



// retorna o texto do menu baseado no user.stage
function getCurrentMenuText(user) {
  const s = user.stage;
  if (menus[s]?.text) return menus[s].text;
  if (s.startsWith('TREINAMENTO')) return menus.TREINAMENTO.text;
  if (s.startsWith('EQUIPE_TEC'))    return menus.EQUIPE_TEC.text;
  if (s.startsWith('FINANCEIRO'))    return menus.FINANCEIRO.text;
  if (s.startsWith('OPERACIONAL'))   return menus.OPERACIONAL.text;
  return menus.MENUPRINCIPAL.text;
}

module.exports = { pushMenu, popMenu, getCurrentMenuText };
