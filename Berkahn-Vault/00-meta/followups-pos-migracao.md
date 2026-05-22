---
tipo: meta
criado: 2026-05-21
atualizado: 2026-05-21
tags:
  - status/active
ai_summary: Follow-ups manuais para Bruno completar pós-migração. Inclui rotação de credenciais, instalação de plugins community Obsidian, ativação do dream Stop hook após semana 2.
status: active
---

# Follow-ups pós-migração

Ações que Bruno precisa completar manualmente para finalizar a migração.

## 🔴 Urgente (segurança)

### 1. Rotacionar credenciais

- [ ] **Supabase Service Role Key**
  - Dashboard Supabase → Settings → API → "Reset service_role key"
  - Atualizar `.env.local` com nova key (`SUPABASE_SERVICE_ROLE_KEY`)
  - Atualizar `.env` se existir (criar com base em `.env.example`)
- [ ] **Revogar 2 GitHub PATs**
  - GitHub → Settings → Developer settings → Personal access tokens
  - Revogar: `ghp_dpF5kMxbkWl0...` e `ghp_Eq7I2NbQUVz9...`
- [ ] **Gerar 1 novo PAT** (escopo mínimo `repo`)
- [ ] **Atualizar git remote**:
  ```powershell
  git remote set-url origin https://NEW_PAT@github.com/danielbkfalci00/berkahn.git
  ```
- [ ] **Validar**: `git fetch origin` deve funcionar

Referências: [[supabase-config]], [[git-remote]]

## 🟡 Setup do vault no Obsidian

### 2. Instalar plugins community

Abrir Obsidian, ir em Settings → Community plugins → Browse, instalar:

- [ ] **Templater** (templates dinâmicos com JS) — usa templates em `91-templates/`
- [ ] **Dataview** (queries inline) — complementa Bases
- [ ] **Periodic Notes** (daily/weekly estruturados) — integra com `template-daily.md`
- [ ] **Tag Wrangler** (renomeação em massa de tags)
- [ ] **Tasks** (checklists avançados)
- [ ] **Linter** (auto-padroniza frontmatter) — config já em `.obsidian/plugins/obsidian-linter/data.json`

Após instalar Templater, ir em Settings → Templater:
- Template folder location: `91-templates`

### 3. Validar Bases renderizando

Abrir cada `.base`:
- [ ] [[artigos.base]] — renderiza com views Publicados / Drafts / SEO incompleto
- [ ] [[memoria.base]] — renderiza com Por subtipo / Atualizadas
- [ ] [[calendario.base]] — renderiza cards + próximos 30 dias + backlog
- [ ] [[tarefas.base]] — renderiza Em aberto / Por prioridade

Se algo não renderiza, ajustar sintaxe consultando docs: https://help.obsidian.md/bases/syntax

## 🟢 Ativação posterior

### 4. Registrar dream Stop hook (após semana 2 de uso)

Após 2 semanas de uso do vault (para evitar consolidação de memória incompleta), adicionar em `~/.claude/settings.json`:

```json
"Stop": [{
  "matcher": "",
  "hooks": [{
    "type": "command",
    "command": "bash \"C:\\Users\\bruno\\.claude\\skills\\dream\\dream-hook.sh\"",
    "timeout": 10
  }]
}]
```

`dream-hook.sh` já existe em `~/.claude/skills/dream/dream-hook.sh`. Auto-check 24h + 5 sessions internamente — zero overhead quando condições não batem.

Skill `dream` continua escrevendo no path nativo (`~/.claude/projects/.../memory/`). Revisar segunda-feira e promover para `Berkahn-Vault/10-memory/` conforme apropriado.

### 5. Smart Connections (opcional, quando vault > 500 notas)

Adicionar busca semântica via embeddings locais. Hoje vault tem ~50 notas — não precisa.

## ✅ Já feito pela migração

- ✅ Branch `vault-migration` criada
- ✅ gitleaks instalado + `.gitleaks.toml` + pre-commit hook
- ✅ Working tree sanitizado (Supabase key, PATs substituídos por placeholders)
- ✅ `Berkahn - Valut/` renomeado para `Berkahn-Vault/`
- ✅ Bug cross-project: removido Brada paths de `additionalDirectories` global
- ✅ 12 pastas + configs do vault criadas
- ✅ 5 arquivos memória migrados + 4 referências novas
- ✅ 6 contextos migrados com wikilinks
- ✅ 9 prompts migrados (locked, sanitizados, frontmatter completo)
- ✅ 9 slash commands atualizados com paths novos
- ✅ Brand + arquitetura + ADMIN_SETUP deduplicado
- ✅ 35 artigos blog + 1 LinkedIn migrados
- ✅ 4 Bases + Canvas + index.md + CLAUDE.md vault-level + MOC + CHANGELOG criados
- ✅ Hooks session-start.ts e validate-write.ts já funcionando (manifest-driven)
