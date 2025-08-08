// src/services/atendimento.js
const fs = require('fs').promises;
const path = require('path');
const { pushMenu } = require('../utils/navegacao'); // ajuste caminho se necessário

const STORE_DIR = path.resolve(__dirname, '../../data'); // ajustável
const STORE_PATH = path.join(STORE_DIR, 'chamados.json');

const DEFAULT_ETAPAS = [
  { key: 'empresa', pergunta: "Informe o nome da sua empresa:" },
  { key: 'usuario', pergunta: "Informe o seu nome do usuário:" },
  { key: 'titulo', pergunta: "Informe o título do chamado (com poucas palavras):" },
  { key: 'descricao', pergunta: "Descreva a situação detalhadamente (aqui capriche nos detalhes):" }
];

/* ---------- Helpers ---------- */
// normaliza origem removendo @c.us (case-insensitive). preserva grupos @g.us
function normalizeOrigin(contact, addPlus = false) {
  if (!contact) return '';
  const s = String(contact);
  if (s.toLowerCase().endsWith('@g.us')) return s; // não altera grupos
  const cleaned = s.replace(/@c\.us$/i, '');
  return addPlus ? (cleaned.startsWith('+') ? cleaned : `+${cleaned}`) : cleaned;
}

function safeString(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function safeUpper(v) {
  const s = safeString(v);
  return s ? s.toUpperCase() : '-';
}

// Title case: primeira letra maiúscula de cada palavra, resto minúsculo
function toTitleCase(v) {
  const s = safeString(v).replace(/\s+/g, ' ').trim();
  if (!s) return '-';
  return s
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/* ---------- Persistência ---------- */
async function ensureStoreDir() {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
  } catch (e) { /* ignore */ }
}

async function loadStore() {
  try {
    await ensureStoreDir();
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { lastId: 0, tickets: {} };
  }
}

async function saveStore(store) {
  await ensureStoreDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function formatId(num) {
  return String(num).padStart(8, '0'); // consistentemente 8 dígitos
}

/* ---------- Ticket persistence ---------- */
async function createTicket(dadosRaw = {}, contact) {
  // aplica formatações desejadas direto aqui
  const dados = {
    empresa: safeUpper(dadosRaw.empresa),
    usuario: safeUpper(dadosRaw.usuario),
    titulo: toTitleCase(dadosRaw.titulo),
    descricao: safeString(dadosRaw.descricao) || '-'
  };

  const store = await loadStore();
  const next = store.lastId + 1;
  store.lastId = next;
  const id = formatId(next);
  const tag = `#ID:${id}`;
  const origin = normalizeOrigin(contact);

  const ticket = {
    id,
    tag,
    contact: origin,
    dados,
    status: 'open',
    createdAt: new Date().toISOString(),
    history: []
  };

  store.tickets[id] = ticket;
  await saveStore(store);
  return ticket;
}

async function getTicketById(idOrTag) {
  const store = await loadStore();
  let id = idOrTag;
  const match = String(idOrTag).match(/(\d{1,})/);
  if (match) id = match[1].padStart(8, '0');
  return store.tickets[id] || null;
}

async function updateTicketStatus(idOrTag, newStatus, note) {
  const store = await loadStore();
  const match = String(idOrTag).match(/(\d{1,})/);
  if (!match) throw new Error('ID inválido');
  const id = match[1].padStart(8, '0');
  const ticket = store.tickets[id];
  if (!ticket) throw new Error('Chamado não encontrado');
  ticket.status = newStatus;
  ticket.history = ticket.history || [];
  ticket.history.push({ when: new Date().toISOString(), status: newStatus, note: note || null });
  await saveStore(store);
  return ticket;
}

/* ---------- Fluxo de coleta ---------- */
async function iniciarFluxoAtendimento(client, contact, user, bodyRaw, opts = {}) {
  const grupoID = opts.grupoID || '120363418165776990@g.us';
  const etapas = opts.etapas || DEFAULT_ETAPAS;
  const retornoMenu = opts.retornoMenu || 'MAIN';
  const trigger = opts.trigger ?? '*';
  const endSessionAfterCreate = !!opts.endSessionAfterCreate;

  // iniciar fluxo se não estiver em CHAMADO e enviar gatilho
  if (user.stage !== 'CHAMADO' && bodyRaw === trigger) {
    user.stage = 'CHAMADO';
    user.chamadoEtapa = 0;
    user.dadosChamado = {};
    user._atendimentoOpts = { grupoID, etapas, retornoMenu, endSessionAfterCreate };
    await client.sendMessage(contact, etapas[0].pergunta);
    return true;
  }

  // se já está no fluxo CHAMADO -> processa etapas
  if (user.stage === 'CHAMADO') {
    const localOpts = user._atendimentoOpts || { grupoID, etapas, retornoMenu, endSessionAfterCreate };
    const currentEtapaIndex = user.chamadoEtapa || 0;
    const etapaAtual = localOpts.etapas[currentEtapaIndex];

    if (etapaAtual) {
      user.dadosChamado[etapaAtual.key] = bodyRaw;
      user.chamadoEtapa = currentEtapaIndex + 1;
    } else {
      user.chamadoEtapa = localOpts.etapas.length;
    }

    // perguntas seguintes
    if (user.chamadoEtapa < localOpts.etapas.length) {
      const proxima = localOpts.etapas[user.chamadoEtapa];
      await client.sendMessage(contact, proxima.pergunta);
      return true;
    }

    // finalizou coleta -> cria ticket e envia ao grupo (try/catch correto)
    const dadosRaw = user.dadosChamado || {};
    try {
      const ticket = await createTicket(dadosRaw, contact);
      const origin = normalizeOrigin(contact);

      // usa os valores já formatados salvos no ticket.dados
      const mensagemGrupo =
`📣 *Nova solicitação de atendimento recebida → ${ticket.tag}*
  🕒 *Criado em:* ${ticket.createdAt}
  🏢 *Empresa:* ${ticket.dados.empresa}
  👤 *Usuário:* ${ticket.dados.usuario}
  📌 *Título:* ${ticket.dados.titulo}
  📝 *Descrição:* ${ticket.dados.descricao}
  📱 *Origem:* ${origin}`;

      // envia para o grupo
      await client.sendMessage(localOpts.grupoID, mensagemGrupo);
      // confirma para o cliente (mensagem direta)
      await client.sendMessage(contact, mensagemGrupo`);

      // encerra sessão se solicitado
      if (localOpts.endSessionAfterCreate) {
        user.stage = 'ENDED';
        user.menuStack = [];
        user.dadosChamado = null;
        user.chamadoEtapa = null;
        user._atendimentoOpts = null;
        await client.sendMessage(contact, 'Sua sessão será encerrada. Até a próxima!');
        return true;
      }

      // volta para menu configurado sem encerrar sessão
      user.stage = localOpts.retornoMenu;
      user.dadosChamado = null;
      user.chamadoEtapa = null;
      user._atendimentoOpts = null;
      try { pushMenu(user, localOpts.retornoMenu); } catch (e) { /* ignore */ }
      await client.sendMessage(contact, `Você foi retornado ao menu: ${localOpts.retornoMenu}`);
      return true;
    } catch (err) {
      console.error('Erro ao criar/enviar chamado:', err);
      await client.sendMessage(contact, "❌ Ocorreu um erro ao criar seu chamado. Tente novamente mais tarde.");
      user.stage = localOpts.retornoMenu;
      user.dadosChamado = null;
      user.chamadoEtapa = null;
      user._atendimentoOpts = null;
      return true;
    }
  }

  // não tratado
  return false;
}

/* export público */
module.exports = {
  iniciarFluxoAtendimento,
  createTicket,
  getTicketById,
  updateTicketStatus
};
