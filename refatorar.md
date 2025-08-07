Seguindo o projeto completo que você enviou, identifiquei padrões repetidos e pontos de melhoria para tornar a navegação **mais robusta**, **menos redundante** e **fácil de estender**. Vou organizar a análise em três partes:

1. **Centralizar lógica de navegação**
2. **Uniformizar empurrar/pop do `menuStack`**
3. **Ajustes pontuais em cada handler**

---

## 1. Centralizar lógica de navegação

Atualmente você replica, em todos os handlers e em `handleMessage`, a lógica de “voltar” (`0`) e “encerrar” (`00`). Ideal é extrair isso para uma função utilitária, deixando cada handler só com seu fluxo de opções.

### Novo módulo: `src/bot/utils/navigation.js`

```js
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
```

**Onde criar:** novo arquivo `src/bot/utils/navigation.js`.

---

## 2. Uniformizar empurrar/pop do menuStack

### Em `handleMessage.js` (arquivo 5)

**Antes (linhas \~15–25):**

```js
  // Encerrar sessão
  if (body === '00' || body === 'encerrar sessão') { … }

  // Voltar para menu anterior
  if (body === '0' || body === 'voltar') {
    if (user.menuStack.length > 1) user.menuStack.pop();
    const previous = user.menuStack.at(-1);
    user.stage = previous;
    …
    return client.sendMessage(contact, text);
  }
```

**Depois (linhas \~15–25):**

```js
  const { popMenu, pushMenu, getCurrentMenuText } = require('../utils/navigation');

  // Encerrar sessão
  if (body === '00' || body === 'encerrar sessão') {
    user.stage = 'ENDED';
    user.menuStack = [];
    return client.sendMessage(contact, 'Até a próxima!');
  }

  // Voltar para menu anterior
  if (body === '0' || body === 'voltar') {
    popMenu(user);
    const text = getCurrentMenuText(user);
    return client.sendMessage(contact, text);
  }
```

E na escolha do menu principal (\~linhas 30–40):

```js
  if (user.stage === 'MAIN') {
    const choice = menus.MAIN.options[bodyRaw];
    if (!choice) { … }
    pushMenu(user, choice);
    const text = getCurrentMenuText(user);
    return client.sendMessage(contact, text);
  }
```

---

## 3. Ajustes pontuais em cada handler

A partir da `navigation.js`, cada handler fica bem enxuto. Exemplo:

### `handleTreinamento.js` (arquivo 7)

* **Remova** todo bloco de “forçado push” e “voltar” duplicado.

* **No topo**, importe e use:

  ```js
  const { pushMenu, popMenu, getCurrentMenuText } = require('../utils/navigation');
  ```

* **Substitua**:

  ```js
  // antes de enviar o menu
  pushMenu(user, 'TREINAMENTO');
  // ... input do usuário ...
  if (body === '0') {
    popMenu(user);
    return client.sendMessage(contact, getCurrentMenuText(user));
  }
  ```

* **Depois de responder** (vídeo), apenas reenvie as opções de navegação:

  ```js
  await client.sendMessage(contact, resp);
  await client.sendMessage(contact, `\n\n📲 *Navegação:*\n0 - Voltar\n00 - Encerrar sessão`);
  ```

### `handleOperacional.js` (arquivo 9)

* **Linha onde faz `user.menuStack.push('OPERACIONAL')`** (aprox. linha 6): substitua por `pushMenu(user, 'OPERACIONAL')`.
* **Bloco de voltar** (aprox. linhas 12–18): substitua por `popMenu(user)` + `getCurrentMenuText(user)`.

E para cada `case 'OPERACIONAL':`:

```js
case 'OPERACIONAL': {
  const nextStage = menus.OPERACIONAL.options[bodyRaw];
  if (!nextStage) { … }
  pushMenu(user, nextStage);
  return client.sendMessage(contact, getCurrentMenuText(user));
}
```

### `handleEquipeTec.js` (arquivo 11)

* **No início**, ao entrar, use `pushMenu(user, 'EQUIPE_TEC')`.
* **Voltar**: `popMenu(user)` + `getCurrentMenuText(user)`.
* **Fluxo de CHAMADO**: quando finalizar, em vez de `user.menuStack.push("EQUIPE_TEC")`, faça `pushMenu(user, 'EQUIPE_TEC')`.

---

## Resumo de modificações

| Arquivo                             | Função              | Linha aproximada        | O que alterar                                                                     |
| ----------------------------------- | ------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `src/bot/utils/navigation.js`       | —                   | —                       | **Novo arquivo** com `pushMenu`, `popMenu`, `getCurrentMenuText`.                 |
| `src/bot/handlers/handleMessage.js` | `handleMessage`     | \~15–25                 | Importar utilitários e substituir bloco de `if(body==='0')` / `if(body==='00')`.  |
| `src/bot/handlers/handleMessage.js` | `handleMessage`     | \~30–40                 | No menu MAIN, usar `pushMenu` e `getCurrentMenuText`.                             |
| `src/bot/handlers/treinamento.js`   | `handleTreinamento` | topo e blocos de voltar | Remover duplicação, usar `pushMenu`, `popMenu`, `getCurrentMenuText`.             |
| `src/bot/handlers/operacional.js`   | `handleOperacional` | linhas 5–15             | Substituir `user.menuStack.push` por `pushMenu`, e bloco de voltar por `popMenu`. |
| `src/bot/handlers/equipeTec.js`     | `handleEquipeTec`   | linhas 5–15             | Mesmo que acima: usar utilitários de navegação para push/pop e texto.             |

Com isso, a lógica de navegação ficará **100% centralizada**, cada handler focado no seu fluxo de opções, e você garante consistência em toda a aplicação. Qualquer dúvida sobre algum ponto específico ou se preferir que eu gere um diff completo de um dos arquivos, basta avisar!
