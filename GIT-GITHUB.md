
# 📘 Manual Git: Atualizar a Branch Feature com Develop e Subir para o Remoto

## 📌 Cenário
- Branch remota: `main`, `develop`, `feature`
- Você tem **alterações locais** na branch `feature`
- Outros devs atualizaram a branch `develop` no remoto
- Você quer **unir as alterações de `develop` + suas mudanças** e enviar tudo para a branch remota `feature`

---

## 🛠️ Passo a Passo

### 1. 🔄 Atualize seu repositório local
Antes de qualquer coisa, traga as últimas mudanças do repositório remoto.

```bash
# Estando em qualquer branch
git fetch origin
```

---

### 2. 📍 Verifique que está na sua branch feature
```bash
git checkout feature
```

---

### 3. 🧩 Mesclar develop na sua feature (merge)
Agora você precisa **mesclar `develop` em `feature`**, ou seja, unir tudo que outros devs fizeram com suas alterações.

```bash
git merge origin/develop
```

⚠️ **Possíveis situações:**
- ✅ Sem conflitos: Git faz o merge automaticamente.
- ⚠️ Com conflitos: Resolva os conflitos manualmente nos arquivos afetados, depois finalize com:

```bash
git add .
git commit  # Conclui o merge se havia conflitos
```

---

### 4. ✅ Teste o projeto localmente
> **Importante!** Antes de enviar suas alterações para o remoto, teste se tudo funciona corretamente após o merge.

---

### 5. ⬆️ Envie sua branch atualizada para o repositório remoto
Agora que a `feature` tem suas mudanças e as de `develop`, envie para o remoto.

```bash
git push origin feature
```

---

## 🔄 Resumo dos comandos

```bash
# 1. Atualiza as referências remotas
git fetch origin

# 2. Vai para sua branch local feature
git checkout feature

# 3. Mescla as mudanças da develop remota na sua feature local
git merge origin/develop

# 4. Resolve conflitos, se houver
# git add .
# git commit

# 5. Testa tudo, depois envia para o remoto
git push origin feature
```

---

## 📚 Dicas Extras

### Ver histórico do merge:
```bash
git log --oneline --graph --all
```

### Se preferir **rebase** em vez de merge (opcional e avançado):
```bash
# Isso reescreve o histórico da sua feature com as mudanças da develop
git rebase origin/develop
```

---

## 🟢 Fluxo recomendado

```plaintext
feature (local com alterações)
    ↓ merge
develop (remoto atualizado)
    ↓
feature (agora com tudo junto)
    ↓ push
feature (remoto atualizado com tudo)
```

---

## ❓ Dúvidas Frequentes

| Dúvida                                 | Resposta breve                                                        |
|---------------------------------------|-----------------------------------------------------------------------|
| Vai perder minhas alterações?         | ❌ Não, o merge preserva suas mudanças e as une com as dos outros devs|
| Preciso fazer merge na develop?       | ❌ Não, apenas precisa mesclar **develop → feature**                  |
| Posso fazer isso sempre?              | ✅ Sim, é o fluxo normal de atualização de branches                   |

---

## ✅ Pronto!
Agora sua branch `feature` está atualizada com tudo e pronta para continuar o desenvolvimento ou abrir um Pull Request.
