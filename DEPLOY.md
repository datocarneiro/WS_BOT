Perfeito — sou seu especialista DevOps aqui. Já comecei a **analisar o repositório** que você mandou (`https://github.com/datocarneiro/WS_BOT`) para entender o contexto antes de propor qualquer ação. Achei a estrutura do projeto e arquivos importantes (resumo abaixo). (Fonte: repositório). ([GitHub][1])

### Resumo rápido do que encontrei no repositório

* Projeto em **Node.js / JavaScript** (há `package.json`, `src/` com `src/bot/index.js` como entry). ([GitHub][1])
* Possui **Dockerfile** e **docker-compose.yml** (ou seja: já há suporte a containerização). ([GitHub][1])
* Tem um `.env` (variáveis de ambiente) — atenção: provavelmente guarda tokens/credenciais. ([GitHub][1])
* Código indica que é um **bot WhatsApp** (eventos: ready, qr, authenticated, etc.) — isso implica que precisa de persistência de sessão/arquivos para não perder login QR. ([GitHub][1])

> Observação importante: antes de subir em produção precisaremos garantir que os arquivos de sessão/credenciais **fiquem persistidos** (volume ou pasta no servidor) para evitar logins QR repetidos.

---

## Visão geral do que vamos fazer (alto nível)

Vamos dividir o trabalho em três etapas (como pediu), com opções e explicações do **porquê** de cada técnica:

1. **Colocar a aplicação para rodar no Ubuntu Server 24.04**

   * Opções: **(A) Docker / docker-compose (recomendado)** — isola dependências, fácil deploy, fácil restart/rollback; **(B) direto no Node.js com PM2 ou systemd** — menor overhead, bom se preferir não usar containers.
2. **Fazer com que a aplicação seja auto-start no boot**

   * Se usar Docker: usar `restart` no `docker-compose.yml` e garantir `systemd`/docker habilitado no boot.
   * Se rodar com Node: usar **PM2** com `pm2 startup` (ou criar unit file systemd).
3. **Garantir que o servidor volte ligado após queda de energia (auto power-on)**

   * Isso **não** é software — é configuração **BIOS/UEFI** (AC Power Recovery / Restore on AC Power Loss) ou *IPMI/iLO/DRAC* se seu hardware tiver. Alternativas: Wake-on-LAN com equipamento apropriado ou UPS com automações. Vou explicar opções concretas e comandos/ações possíveis.

Fontes para instalação do Docker (seguiremos esse fluxo para Ubuntu 24.04, se escolher Docker): documentação oficial do Docker. ([Docker Documentation][2])
Fontes para configurar auto-start de processos Node: `systemd` e `pm2` docs/artigos. ([pm2.keymetrics.io][3])
Sobre **AC Power Recovery / Restore on AC Power Loss** (onde ativar no BIOS): manuais dos fabricantes (ex.: Dell) e guias gerais. ([Dell][4])

---

## Roadmap numerado (detalhado) — cada passo com **o que fazer** e **por que**

> Importante: **não executo nada no seu servidor** — eu descrevo comandos e arquivos; você executa quando autorizar. Só seguimos para a próxima etapa depois da sua autorização.

### Etapa 0 — Pré-requisitos & checagens iniciais (antes de qualquer deploy)

0.1. Acesse o servidor (SSH) e verifique versão do SO:

```bash
lsb_release -a
uname -m
```

Por quê: confirmar que é Ubuntu Server 24.04 e arquitetura (x86\_64 vs arm) — alguns pacotes/containers variam.

0.2. Confirmar que tem acesso root/sudo.
Por quê: operações de instalação e serviços exigem privilégios.

0.3. Ter o link do repositório e as credenciais (se privado).
Por quê: vamos clonar e configurar `.env`.

---

### Etapa 1 — Preparar o servidor e clonar o repositório

1.1. **Atualizar sistema**

```bash
sudo apt update && sudo apt upgrade -y
```

Por quê: segurança e compatibilidade de pacotes.

1.2. **Instalar Git** (se não tiver)

```bash
sudo apt install -y git
```

1.3. **Clonar repositório**

```bash
cd /opt
sudo git clone https://github.com/datocarneiro/WS_BOT.git ws_bot
sudo chown -R $USER:$USER ws_bot
cd ws_bot
```

Por quê: `/opt` é local comum para apps; `chown` para seu usuário poder operar.

1.4. **Revisar `.env` e variáveis sensíveis**

* Abra `ws_bot/.env` e verifique valores necessários (TOKEN, PATHs, etc).
  Por quê: variáveis definem comportamento em runtime e dados sensíveis não devem ficar em VCS.

---

### Etapa 2 — (Recomendado) Rodar com Docker / docker-compose

> RAZÃO: Docker encapsula Node, garante ambiente previsível e facilita reinício/upgrade. Repo já tem `Dockerfile` e `docker-compose.yml`, o que facilita muito. ([GitHub][1])

2.1. **Instalar Docker Engine (modo recomendado: repositório oficial)** — passos resumidos (baseado na doc oficial):

```bash
# remover velhas versões conflitantes (se houver)
sudo apt remove -y docker docker-engine docker.io containerd runc

# instalar dependências
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# adicionar GPG do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# adicionar repo oficial
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $UBUNTU_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

(Detallhes e variações: doc oficial Docker). ([Docker Documentation][2])

2.2. **Adicionar seu usuário ao grupo docker** (opcional, evita `sudo`):

```bash
sudo usermod -aG docker $USER
# e então relogar no ssh para aplicar o grupo
```

2.3. **Ajustar docker-compose.yml para persistência e restart**

* Edite `docker-compose.yml` no repo para garantir volumes para sessão (ex.: `./data:/app/data`) e `restart: unless-stopped`.
  Exemplo mínimo (snippet):

```yaml
services:
  ws_bot:
    build: .
    container_name: ws_bot
    restart: unless-stopped
    volumes:
      - ./data:/usr/src/app/data   # persistir sessões/arquivos
      - ./logs:/usr/src/app/logs
    env_file:
      - .env
    # se usa portas, mapear:
    # ports:
    #   - "3000:3000"
```

Por quê: `restart: unless-stopped` faz o container reiniciar automaticamente após reboot; volumes garantem persistência de sessão (essencial para bot WhatsApp).

2.4. **Build e start**

```bash
cd /opt/ws_bot
docker compose up -d --build
```

Por quê: constroi a imagem e sobe o serviço em background.

2.5. **Checar logs e status**

```bash
docker ps
docker compose logs -f
```

Por quê: validar que o bot subiu e está pronto (ver evento `ready`/`qr` no logs).

---

### Etapa 3 — Alternativa: Rodar sem Docker (Node + PM2 ou systemd)

Se preferir **não usar Docker**, aqui estão duas opções:

#### 3A — Usando PM2 (fácil para Node)

* Instalar Node.js (recomendo NodeSource ou nvm).
* Instalar dependências do projeto:

```bash
cd /opt/ws_bot
npm install
```

* Instalar PM2 global e iniciar app:

```bash
sudo npm install -g pm2
pm2 start src/bot/index.js --name ws_bot
pm2 save
pm2 startup systemd
# siga instrução que o pm2 startup imprimir (exa: sudo env PATH=... pm2 startup systemd -u seuuser --hp /home/seuuser)
```

Por quê: PM2 gerencia processos Node, restarts automáticos, geração de script de startup (`pm2 startup`) mantém apps após reboot. ([pm2.keymetrics.io][3])

#### 3B — Usando systemd diretamente

* Criar um unit file para systemd, ex:

```ini
# /etc/systemd/system/ws_bot.service
[Unit]
Description=WS_BOT Node.js Service
After=network.target

[Service]
Type=simple
User=seuuser
WorkingDirectory=/opt/ws_bot
EnvironmentFile=/opt/ws_bot/.env
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ws_bot

[Install]
WantedBy=multi-user.target
```

* Habilitar e iniciar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ws_bot.service
sudo systemctl start ws_bot.service
sudo journalctl -u ws_bot -f
```

Por quê: systemd é nativo, simples e confiável para serviços do sistema. ([NodeSource][5])

---

### Etapa 4 — Logs, monitoração e backup de sessão

4.1. Logrotate (se gerar logs em arquivos).
4.2. Backup periódico da pasta de sessão (via `cron` ou script).
Por quê: evitar perda da sessão e facilitar troubleshooting.

---

### Etapa 5 — Testes e validação

* Validar que o bot responde a comandos/recebe mensagens.
* Teste reboot do servidor:

```bash
sudo reboot
# após voltar:
docker ps   # ou systemctl status ws_bot
```

* Verificar que serviço sobe automaticamente.

---

### Etapa 6 — Fazer o servidor ligar automaticamente após queda de energia (auto power-on)

Isto é **fora** do Linux — depende do hardware/firmware:

6.1. **AC Power Recovery / Restore on AC Power Loss** (BIOS/UEFI)

* Entre no BIOS/UEFI do servidor (geralmente tecla DEL / F2 / F10 / F12 durante POST).
* Procure por configurações: `AC Power Recovery`, `Restore on AC Power Loss`, `After Power Loss` e defina para `Power On` ou `Last State`.
* Fabricantes diferentes têm nomes diferentes — ex.: Dell chama `AC Recovery`. (Exemplo de manual de Dell que documenta essa opção). ([Dell][4])

6.2. **Se o servidor tiver IPMI / iLO / DRAC**

* Pode-se usar a interface de gerenciamento remoto para configurar auto-power or para dar power-on remoto quando necessário (`ipmitool chassis power on`).
* Ex.: `ipmitool -I lanplus -H <ipmi-ip> -U <user> -P <pass> chassis power on`.

6.3. **Wake-on-LAN (WOL)** — alternativa que requer outra máquina para enviar magic-packet quando a energia voltar; menos confiável em casos de perda total de energia porque precisa de rede ativa no momento.

6.4. **UPS + automação**

* Um **no-break (UPS)** pode ser usado para manter servidor ligado durante queda curta e permitir shutdown ordenado em queda prolongada. Alguns UPS e software (NUT/APC) podem ligar/desligar em conjunto com o host.
* Por quê: muitas quedas não são instantâneas; UPS preserva integridade dos dados e evita hardware danificado.

Resumo: para **auto power-on quando a energia voltar** — a ação mais direta é ativar a opção no BIOS/UEFI (`Restore on AC Power Loss`) ou usar IPMI se disponível. ([Video Window Support Center][6])

---

## Checklist rápido que vou executar (com sua autorização) — eu só forneço os comandos e te guio:

1. Checar SO e arquitetura.
2. Escolher método (Docker recomendado) — instalar Docker (comandos oficiais). ([Docker Documentation][2])
3. Clonar repo em `/opt/ws_bot` e configurar `.env`.
4. Ajustar `docker-compose.yml` para `restart` e volumes (exemplo já preparado).
5. `docker compose up -d --build` e validar logs.
6. Habilitar monitor e backups.
7. Explicar passo-a-passo para ativar `AC Power Recovery` no BIOS (vou te indicar exatos passos de acordo com fabricante do seu servidor, se me disser modelo). ([Dell][4])

---

## O que eu preciso de você agora

1. Confirma que **quer seguir com a abordagem Docker** (recomendada) ou prefere **Node + PM2/systemd**?
2. Me confirme que você tem acesso SSH com usuário com `sudo` no servidor (Ubuntu Server 24.04).
3. Se quiser que eu gere arquivos prontos (ex.: `docker-compose.yml` ajustado, `systemd` unit, scripts de backup), eu gero aqui e você copia/cola no servidor quando autorizar.
4. Se quiser que eu te guie para ativar auto power-on no BIOS, me diga o **modelo do hardware** (ex.: Dell PowerEdge R640, HP ProLiant ML350, Raspberry Pi, etc.) — assim eu dou passos específicos (se preferir, posso dar instruções genéricas).

---

Diz qual opção prefere (Docker ou Node+PM2) e autoriza eu **continuar para o Passo 1** — assim eu preparo os comandos exatos e arquivos já prontos para você aplicar no seu servidor. Vou esperar sua autorização para prosseguir.

[1]: https://github.com/datocarneiro/WS_BOT.git "GitHub - datocarneiro/WS_BOT"
[2]: https://docs.docker.com/engine/install/ubuntu/?utm_source=chatgpt.com "Install Docker Engine on Ubuntu"
[3]: https://pm2.keymetrics.io/docs/usage/startup/?utm_source=chatgpt.com "Startup Script"
[4]: https://www.dell.com/support/manuals/en-us/optiplex-3080-micro/optiplex3080_micro_specs/power-management?guid=guid-ead7b30e-2bf2-4cfd-8a1a-0afe8edf3884&lang=en-us&utm_source=chatgpt.com "OptiPlex 3080 Micro Setup and Specifications | Dell US"
[5]: https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/?utm_source=chatgpt.com "Running Your Node.js App With Systemd - Part 1"
[6]: https://videowindowglobal.zohodesk.com/portal/en/kb/articles/how-can-i-enable-my-computer-to-automatically-power-on-after-a-power-outage?utm_source=chatgpt.com "How can I enable my computer to automatically power on in ..."
