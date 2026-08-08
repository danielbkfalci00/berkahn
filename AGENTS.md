# AGENTS.md — Site Berkahn

Instruções projeto-level para Codex. Para regras específicas do vault, ver `Berkahn-Vault/CLAUDE.md`.

---

## ⚠️ Compliance (reutilização sobre criação)

Antes de propor mudanças, confirmar:

> **COMPLIANCE CONFIRMADO**: Vou priorizar a reutilização em vez da criação

**Regras**:
- ❌ NÃO criar novos arquivos sem analisar existentes primeiro
- ❌ NÃO rewrite quando refactor cabe
- ❌ NÃO advice genérico — sempre cite `file_path:line_number`
- ✅ Estender services/components existentes
- ✅ Consolidar duplicações
- ✅ Referenciar paths específicos

Contexto: projeto teve histórico de criação de duplicatas. Toda decisão de "criar novo" precisa justificativa de por que existente não serve.

---

## Memória e Contexto (Vault Obsidian)

**Fonte única**: `Berkahn-Vault/` (versionado no git, secrets em `.env`)

### Padrão de leitura (token-efficient)

Padrão **SKIM → GREP → READ TARGETED** reduz 60-70% tokens vs leitura defensiva:

1. **SKIM** (auto via SessionStart hook):
   - este `AGENTS.md`
   - `Berkahn-Vault/index.md` (entry point)
   - `Berkahn-Vault/10-memory/MEMORY.md` (índice)
   - `Berkahn-Vault/00-meta/projetos/sprint-ativa.md` (sprint atual)

2. **GREP** quando precisar de info específica:
   - `Grep "ai_summary:" Berkahn-Vault/` → TL;DRs de todas notas em uma chamada
   - `Grep "termo" Berkahn-Vault/` → busca contextual
   - `obsidian-cli search "termo"` → ranking + backlinks

3. **READ TARGETED** após grep:
   - Abrir só notas com hit relevante
   - Wikilinks dentro guiam para detalhes

**Cada nota tem `ai_summary` no frontmatter** — leia primeiro.

### Estrutura do vault

```
Berkahn-Vault/
├── 00-meta/         MOC, CHANGELOG, projetos, standup, wrap-up
├── 10-memory/       user, feedback, project, reference
├── 20-context/      domínio (brand, SEO, pipeline, LSF, design)
├── 30-prompts/      calibrados (locked: true — NÃO ALTERAR sem permissão)
├── 40-content/      blog (publicados/drafts/ideias/pesquisa), linkedin, apresentações, materiais, auditorias-seo
├── 50-brand/        guia design, logos
├── 60-arquitetura/  stack, admin, integrações
├── 70-knowledge/    atomic notes
├── 80-bases/        artigos, memoria, calendario, tarefas (.base)
├── 90-canvas/       diagramas
├── 91-templates/    Templater
└── 99-archive/
```

Regras de naming, frontmatter e taxonomy em `Berkahn-Vault/CLAUDE.md`.

---

## 🚀 Projetos Ativos (8 hubs first-class)

Cada projeto tem nota-hub em `Berkahn-Vault/00-meta/projetos/{nome}.md` com `tipo: projeto`, KPIs (`kpi_*` FLAT), bloqueios, próximos 7 dias e links de contexto/workflow.

| Projeto | Hub | Workflow | Subagents recomendados |
|---------|-----|----------|------------------------|
| Blog | [[blog]] | [[workflow-conteudo]] | `@pragmatic-code-review` (componentes article/) |
| LinkedIn | [[linkedin]] | [[workflow-conteudo]] | — |
| Site | [[site]] | [[workflow-site]] | `@pragmatic-code-review`, `@design-review`, `@security-review` |
| SEO/AEO | [[seo-aeo]] | [[workflow-seo]] | — |
| Apresentações | [[apresentacoes]] | [[workflow-comercial]] | `@design-review` |
| Materiais | [[materiais]] | [[workflow-material]] | `@design-review` |
| Pesquisas | [[pesquisas]] | [[workflow-pesquisa]] | — |
| Orçamento-automação | [[orcamento-automacao]] | [[workflow-site]] | `@pragmatic-code-review`, `@design-review`, `@security-review` |

**Dashboards dinâmicos**: `Berkahn-Vault/80-bases/{projetos,kpis,conhecimento,materiais}.base`

**Regra**: todo novo conteúdo gera nota com `projeto: <nome>` no frontmatter (entre `status` e `slug`). Outputs devem linkar pelo menos 1 contexto via wikilink (`[[berkahn-brand]]`, `[[seo-aeo-strategy]]`, etc.).

---

## Workflow semanal

| Dia | Comando | Output em |
|-----|---------|-----------|
| Segunda 9h | `/standup` (auto via `berkahn-standup-semanal`) | `00-meta/standup/YYYY-MM-DD.md` |
| Segunda 14h | `/brainstorm` | `40-content/blog/ideias/ideas-YYYY-MM.md` |
| Terça | `/pesquisa` | bloco Pesquisa da pauta em `/admin/conteudo` |
| Quarta | `/criacao` | `40-content/blog/drafts/[slug].md` |
| Quinta | `/artigo produzir` + aprovação + `/artigo publicar` | post draft → publicado; LinkedIn fecha no card |
| Sexta 17h | `/wrap-up` (auto via `berkahn-wrapup-semanal`) | `00-meta/wrap-up/YYYY-MM-DD.md` |
| Domingo 03h | `dream` (auto, semana 2+) | `~/.Codex/projects/.../memory/` (revisar segunda) |

---

## Slash commands disponíveis

| Comando | O que faz |
|---------|-----------|
| `/artigo` | `produzir` cria draft; `publicar` exige aprovação |
| `/linkedin` | Grava texto, prompt e briefing no card |
| `/brainstorm` | Ideias priorizadas (gera `40-content/blog/ideias/`) |
| `/pesquisa` | Pesquisa tema + artigo completo (grava na pauta) |
| `/criacao` | Draft final (gera `40-content/blog/drafts/`) |
| `/apresentacao` | Slide na apresentação executiva |
| `/material` | Briefing material Canva |
| `/calendario` | Pipeline do quadro; `calendario.base` é acervo |
| `/seo` | Auditoria SEO/AEO (gera `40-content/auditorias-seo/`) |
| `/standup` | Standup semanal — atualiza sprint-ativa + 7 hubs (auto seg 9h) |
| `/wrap-up` | Wrap-up semanal — consolida KPIs deltas + atualiza hubs (auto sex 17h) |

Todos referenciam prompts em `Berkahn-Vault/30-prompts/` e contexto em `Berkahn-Vault/20-context/`.

### Scheduled-tasks ativas

Listáveis via skill `scheduled-tasks` (MCP) ou em `~/.Codex/scheduled-tasks/`:
- `berkahn-standup-semanal` — cron `0 9 * * 1` (segunda 9h)
- `berkahn-wrapup-semanal` — cron `0 17 * * 5` (sexta 17h)
- `worker-de-conte-do-berkahn` — a cada 15 min; processa no máximo 1 job do quadro, sem aprovar/publicar

Cada um roda em sessão fresca lendo `.Codex/commands/{standup,wrap-up}.md`. Notifica Bruno ao completar.

---

## Subagents disponíveis

| Subagent | Quando usar |
|----------|-------------|
| `@agent-pragmatic-code-review` | Code review pós-feature ou pré-merge (Opus, framework Net Positive) |
| `@agent-security-review` | Antes de auth/payments/data handling (Opus, false-positive minimization) |
| `@agent-design-review` | UI/UX changes (Sonnet + Playwright, live env first) |

Detalhes em `.Codex/subagents/`.

---

## Stack do projeto

Visão completa em `Berkahn-Vault/60-arquitetura/stack-nextjs-supabase.md`:
- Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui
- Supabase (PostgreSQL + Auth + RLS) — tabela `posts`
- Vercel deploy
- Leads no Supabase como fonte primária; Google Sheets é espelho assíncrono via Apps Script

Comandos críticos:
```bash
npm run dev          # dev server (porta 3000+)
npm run build        # build produção
gitleaks detect      # scan secrets (auto em pre-commit)
```

### Scripts vault (`scripts/vault-*.mjs`) — Sprint 2 e 3

| Script | Uso |
|--------|-----|
| `vault-backfill-articles.mjs` | Normaliza frontmatter dos artigos publicados (FLAT, ordem canônica) + rename para slug canonical. Idempotente. Flags `--dry-run`, `--rename` |
| `vault-backfill-ai-summary.mjs` | Preenche `ai_summary` (de description ou lead) + adiciona rodapé padrão com wikilinks. Detecta marker `<!-- vault-rodape-v1 -->` para idempotência |
| `vault-supabase-resync.mjs` | Compara slugs vault ↔ Supabase (`--check`) ou faz PATCH `meta_title/meta_description/answer_summary` (`--patch=slug1,slug2`). Requer `$env:SUPABASE_SERVICE_KEY` |
| `vault-validate.mjs` | Linter de completude vault (9 validações, exit 0/1/2, output ANSI ou `--json`). Rodado manual ou via `/standup`, `/wrap-up` |
| `conteudo/pauta.mjs` | CLI genérico do quadro: contexto seletivo (`proxima`), validação, escrita com `--expected-updated-at` e ciclo `job-claim|complete|fail`. Publicação continua humana |
| `vault-images.mjs` | Banco de imagens (`Docs/banco-imagens/`). `--inventory` (manifesto + flag `em_producao` cruzada por sha256 com `public/images/`), `--dupes` (duplicatas exatas + pares PNG/WEBP), `--check` (contagens vs índices), `--thumbs` (gera thumbnails webp). Entry-point do catálogo: `Berkahn-Vault/40-content/materiais/banco-imagens.md` |
| `watermark-images.mjs` | Marca d'água BERKAHN em lote (Node + sharp). Isola o wordmark "BERKAHN" do logo-texto, centraliza grande com opacidade baixa e cor adaptativa por região. Flags `--src --out --frac --opacity --color --halo --pick --dry-run`. Preserva originais (escreve só em `--out`). Doc de uso: `Berkahn-Vault/40-content/materiais/watermark-clube-quinta-dos-lagos.md` |

Documentação completa: `scripts/VAULT-SCRIPTS-README.md`

---

## Segurança

- Secrets vivem em `.env` / `.env.local` (gitignored). NUNCA hardcodar.
- gitleaks pre-commit hook ativo (`.git/hooks/pre-commit`)
- `.gitleaks.toml` com allowlist para placeholders (`{{VAR}}`, `YOUR-XXX`, `process.env.X`)
- Service role key Supabase: server-side ONLY (bypassa RLS)
- Histórico de incidentes em `Berkahn-Vault/10-memory/reference/supabase-config.md`

---

## Skills + ferramentas (mapping token-efficient)

| Tool | Uso |
|------|-----|
| `Read`/`Write`/`Edit` | Default (zero overhead) |
| `Grep "ai_summary:"` | SKIM rápido de 100+ notas |
| `Glob` | Listagem por pattern |
| `Bash` → `obsidian-cli search` | Ranking + backlinks Obsidian |
| Skill `obsidian-markdown` | Sintaxe nativa (callouts, properties) |
| Skill `obsidian-bases` | Editar `.base` files |
| Skill `frontend-design` | UI quality (componentes, layouts) |
| Skill `code-review` | Code review |
| Skill `security-review` | Security analysis |

**NÃO USAR**: MCP `obsidian-Codex-mcp` (10-40k tokens schema, sem ganho real aqui).

---

## Recursos para aprofundamento

- **Histórico migração**: `Berkahn-Vault/00-meta/CHANGELOG.md`
- **Follow-ups pendentes**: `Berkahn-Vault/00-meta/followups-pos-migracao.md`
- **Memória completa**: `Berkahn-Vault/10-memory/MEMORY.md`
- **MOC visual**: `Berkahn-Vault/00-meta/MOC.md`
- **Vault entry point**: `Berkahn-Vault/index.md`
- **Vault-level rules**: `Berkahn-Vault/CLAUDE.md`

---

## Feedback / Issues

- Bugs no Codex: https://github.com/anthropics/Codex/issues
- Comando help: `/help`
