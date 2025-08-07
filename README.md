# WS_BOT

Estrutura:

WS_BOT/
├─ src/
│  ├─ bot/
│  │  ├─ handlers/
│  │  │  ├─ equipeTec.js
│  │  │  ├─ financeiro.js
│  │  │  ├─ handleMessage.js
│  │  │  ├─ operacional.js
│  │  │  └─ treinamento.js
│  │  ├─ utils/
│  │  │  ├─ getPedido.js
│  │  │  └─ navigation.js
│  │  ├─ client.js
│  │  └─ index.js
│  ├─ menus/
│  │  ├─ equipeTec.js
│  │  ├─ financeiro.js
│  │  ├─ index.js
│  │  ├─ main.js
│  │  ├─ operacional.js
│  │  └─ treinamento.js
│  ├─ utils/
│  │  └─ greetings.js
│  └─ responde.json
├─ .env
├─ .gitignore
├─ docker-compose.yml
├─ Dockerfile
├─ GIT-GITHUB.md
├─ grupos.txt
├─ package-lock.json
├─ package.json
├─ pegarIdGrupo.js
├─ README.md
├─ refatorar.md
├─ Resumo.ipynb
└─ teste_qr.js

# Inicio

1. O arquivo principal é 'src/bot/index.js, 
- aqui iniciamos importamos o objeto/intancia que é definido no arquivo `src/bot/client.js`. 
- a Classe Cliente  e criamos uma nova instancia/ um novo objeto (POO), 












# resumo de Eventos e Métodos

| Prioridade | Tipo     | Nome                                     | Descrição resumida                                                                 |
|------------|----------|------------------------------------------|------------------------------------------------------------------------------------|
| 1️⃣         | Evento   | `ready`                                  | Dispara quando o bot está pronto.                                                 |
| 2️⃣         | Evento   | `qr`                                     | Dispara quando o QR Code é gerado.                                                |
| 3️⃣         | Evento   | `message`                                | Dispara ao receber uma nova mensagem.                                             |
| 4️⃣         | Método   | `sendMessage(chatId, content, options)`  | Envia mensagem para um chat.                                                      |
| 5️⃣         | Evento   | `authenticated`                          | Autenticação bem-sucedida.                                                        |
| 6️⃣         | Evento   | `auth_failure`                           | Falha na autenticação da sessão.                                                  |
| 7️⃣         | Evento   | `disconnected`                           | Disparo quando o cliente é desconectado.                                          |
| 8️⃣         | Método   | `initialize()`                           | Inicializa o cliente e inicia o processo de login.                                |
| 9️⃣         | Método   | `getChats()`                             | Retorna todos os chats ativos.                                                    |
| 🔟         | Método   | `getContacts()`                          | Retorna todos os contatos.                                                        |
| 11️⃣        | Método   | `getChatById(chatId)`                    | Busca chat específico pelo ID.                                                    |
| 12️⃣        | Método   | `getMessageById(messageId)`              | Busca mensagem específica pelo ID.                                                |
| 13️⃣        | Evento   | `message_create`                         | Dispara quando uma nova mensagem é criada (inclusive do próprio bot).             |
| 14️⃣        | Evento   | `message_ack`                            | Dispara quando há confirmação de entrega/leitura.                                 |
| 15️⃣        | Método   | `sendSeen(chatId)`                       | Marca mensagem como visualizada.                                                  |
| 16️⃣        | Evento   | `message_revoke_everyone`                | Dispara quando mensagem é apagada para todos.                                     |
| 17️⃣        | Método   | `logout()`                               | Desconecta e encerra a sessão atual.                                              |
| 18️⃣        | Método   | `destroy()`                              | Fecha o cliente por completo.                                                     |
| 19️⃣        | Método   | `isRegisteredUser(contactId)`           | Verifica se um número está registrado no WhatsApp.                                |
| 20️⃣        | Evento   | `call`                                   | Dispara quando uma chamada é recebida.                                            |
| 21️⃣        | Evento   | `group_join`                             | Alguém entrou ou foi adicionado em grupo.                                         |
| 22️⃣        | Evento   | `group_leave`                            | Alguém saiu ou foi removido de grupo.                                             |
| 23️⃣        | Método   | `createGroup(title, participants)`      | Cria novo grupo com usuários.                                                     |
| 24️⃣        | Método   | `getBlockedContacts()`                   | Retorna contatos bloqueados.                                                      |
| 25️⃣        | Evento   | `group_update`                           | Configurações de grupo alteradas.                                                 |
| 26️⃣        | Evento   | `message_reaction`                       | Reação enviada ou recebida em mensagem.                                           |
| 27️⃣        | Método   | `getState()`                             | Obtém o estado atual da conexão do cliente.                                       |
| 28️⃣        | Evento   | `group_admin_changed`                    | Um usuário foi promovido ou rebaixado no grupo.                                   |
| 29️⃣        | Método   | `getCommonGroups(contactId)`            | Retorna grupos em comum com um contato.                                           |
| 30️⃣        | Evento   | `contact_changed`                        | Um contato mudou de número.                                                       |
| 31️⃣        | Evento   | `message_edit`                           | Uma mensagem foi editada (novo recurso do WhatsApp).                              |
| 32️⃣        | Método   | `setStatus(status)`                      | Define nova frase de status.                                                      |
| 33️⃣        | Método   | `setDisplayName(name)`                   | Altera o nome exibido do perfil.                                                  |
| 34️⃣        | Método   | `setProfilePicture(media)`              | Define nova foto de perfil.                                                       |
| 35️⃣        | Método   | `getProfilePicUrl(contactId)`           | Busca URL da foto de perfil de um contato.                                        |
| 36️⃣        | Método   | `pinChat(chatId)`                        | Fixa um chat no topo.                                                             |
| 37️⃣        | Método   | `unpinChat(chatId)`                      | Desfixa chat do topo.                                                             |
| 38️⃣        | Método   | `muteChat(chatId, date?)`                | Silencia chat.                                                                    |
| 39️⃣        | Método   | `unmuteChat(chatId)`                     | Remove o silêncio de um chat.                                                     |
| 40️⃣        | Evento   | `message_ciphertext`                     | Mensagem criptografada recebida.                                                  |
| 41️⃣        | Evento   | `message_revoke_me`                      | Bot apagou sua própria mensagem.                                                  |
| 42️⃣        | Evento   | `unread_count`                           | Mudança na contagem de não lidas.                                                 |
| 43️⃣        | Evento   | `chat_removed`                           | Chat removido.                                                                    |
| 44️⃣        | Evento   | `chat_archived`                          | Chat arquivado/desarquivado.                                                      |
| 45️⃣        | Evento   | `loading_screen`                         | Tela de carregamento ativa (percentual).                                          |
| 46️⃣        | Evento   | `vote_update`                            | Alguém votou em enquete/poll.                                                     |
| 47️⃣        | Método   | `getNumberId(number)`                    | Retorna ID WhatsApp registrado de um número.                                      |
| 48️⃣        | Método   | `searchMessages(query, options?)`       | Busca mensagens por texto.                                                        |
| 49️⃣        | Método   | `markChatUnread(chatId)`                 | Marca chat como não lido.                                                         |
| 50️⃣        | Método   | `sendPresenceAvailable()`                | Marca o bot como online.                                                          |
| 51️⃣        | Método   | `sendPresenceUnavailable()`              | Marca o bot como offline.                                                         |
| 52️⃣        | Método   | `getWWebVersion()`                       | Retorna versão atual do WhatsApp Web.                                             |
| 53️⃣        | Evento   | `remote_session_saved`                   | Sessão remota salva (RemoteAuth).                                                 |
| 54️⃣        | Evento   | `change_state`                           | Estado da conexão mudou.                                                          |
| 55️⃣        | Evento   | `change_battery`                         | Porcentagem da bateria mudou (obsoleto).                                          |
| 56️⃣        | Evento   | `group_membership_request`               | Pedido para entrar em grupo com aprovação.                                       |
| 57️⃣        | Genérico | `on(event, listener)`                    | Registra evento genérico (pouco usado diretamente).                               |
