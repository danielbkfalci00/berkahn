---
tipo: meta
criado: 2026-05-21
atualizado: 2026-08-11
tags:
  - ai/context
  - status/active
ai_summary: Regras vault-level para Claude operar no Berkahn-Vault. Frontmatter schema, tag taxonomy, locked notes, naming conventions, padrão token-efficient. SEPARADO do CLAUDE.md do projeto (que vive em ../CLAUDE.md).
status: active
---

# CLAUDE.md (vault-level) — Berkahn-Vault

Regras de operação dentro do vault. Para regras do projeto inteiro, ver `../CLAUDE.md`.

## Frontmatter obrigatório

Toda nota DEVE ter (mínimo):
```yaml
---
tipo: memory | prompt | context | atomic | draft-content | meta | projeto | indice | auditoria | pesquisa | legal | site-copy | apresentacao | linkedin-post | daily | documentacao
criado: YYYY-MM-DD
atualizado: YYYY-MM-DD
tags: [domain/X, status/Y]
ai_summary: TL;DR 1-3 linhas para Claude fazer grep+skim.
status: draft | active | review | published | archived | locked | stale
---
```

**Regras universais**:
- **Flat sempre** — nunca aninhar (`seo: {title: ...}` quebra Properties + Bases). Use prefixos: `seo_title`, `seo_description`, `kpi_publicados`, `kpi_meta_publicados_semanal`, etc.
- `ai_summary` em **toda** nota — habilita SKIM via grep.
- Linter plugin padroniza automaticamente (config em `.obsidian/plugins/obsidian-linter/data.json` — yamlKeyOrder com 95+ campos canônicos pós-Sprint 3.0).
- Ordem canônica de keys: ver `data.json` do linter. Resumo: `tipo → criado → atualizado → tags → ai_summary → status → subtipo/locked → projeto → slug → seo_* → answer_summary → supabase_id → url_* → kpi_* → contextos_aplicados → workflow → prompts_relacionados → bases_relacionadas → subagents_uteis → projetos_relacionados → linkedin_slug/material_visual_slug/artigo_slug → usado_em → origem_pesquisa → path_externo → demais`

### Campos por tipo (expandido pós-Sprint 2.4 + 3)

**`tipo: projeto`** (hubs em `00-meta/projetos/`):
```yaml
projeto: blog | linkedin | site | seo-aeo | apresentacoes | materiais | pesquisas | orcamento-automacao
kpi_<nome>: <valor>             # FLAT, repetir por KPI (kpi_publicados, kpi_meta_publicados_semanal, etc.)
kpi_atualizado_em: YYYY-MM-DD
contextos_aplicados: [array de nomes sem [[]]]
workflow: <nome do workflow em 10-memory/project/>
prompts_relacionados: [array]
bases_relacionadas: [array]
subagents_uteis: [array]
```

**`tipo: draft-content`** (artigos em `40-content/blog/publicados/`):
```yaml
projeto: blog
slug: <kebab-case = filename>
data_publicacao: YYYY-MM-DD
title, description, palavras_chave, category, read_time, author (preservados)
seo_title (≤60 chars), seo_description (150-160 chars)
supabase_id, url_final
linkedin_slug: <slug LinkedIn post ou null>
material_visual_slug: <nome.webp ou null>
answer_summary: 80-120 palavras AEO (≠ ai_summary 1-3 linhas)
contextos_aplicados: [berkahn-brand, seo-aeo-strategy, article-pipeline, copy-sem-travessao, steel-frame-domain]
```

**`tipo: atomic`** (notas em `70-knowledge/`):
```yaml
usado_em: [array de slugs de artigos que referenciam]
origem_pesquisa: <slug pesquisa raw ou ""></code>
```

**`tipo: indice`** (índices de binaries em `40-content/materiais/indices/`):
```yaml
projeto: <projeto associado>
path_externo: ../../../../Docs/<path>/
arquivos_total: <N>
arquivos_mapeados, arquivos_orfaos, arquivos_duplicados (opcionais)
```

**Banco de imagens**: fonte em `Docs/banco-imagens/` (9 categorias, ~160 arquivos). Entry-point [[40-content/materiais/banco-imagens|banco-imagens]] (MOC) → 9 `indices-<categoria>.md` + galerias visuais `galeria-<categoria>.md` (thumbnails em `40-content/materiais/banco-imagens/thumbs/`). Dashboard [[banco-imagens.base]]. Gerido por `scripts/vault-images.mjs` (`--inventory/--dupes/--check/--thumbs`). Rodar `--check` após mexer nos binários.

**`tipo: auditoria`** (em `40-content/auditorias-seo/`):
```yaml
data_diagnostico: YYYY-MM-DD
kpi_score, kpi_paginas_indexadas, kpi_paginas_total
substitui: <slug versão anterior>  # se aplica
```

**Campo `projeto:` é obrigatório** em notas vinculadas a um projeto. Use `projetos_relacionados: [blog, site]` para cross-projeto.

**Diferença crítica `ai_summary` vs `answer_summary`**:
- `ai_summary` (vault frontmatter, 1-3 linhas): TL;DR para Claude SKIM via Grep
- `answer_summary` (vault + Supabase, 80-120 palavras): AEO-optimized para citação por IAs (sem hedging, com dado quantitativo)

## Tag taxonomy (5 raízes, inglês)

```
#domain/   -> assunto tecnico: domain/admin, domain/architecture, domain/brand, domain/drywall, domain/financiamento, domain/integrations, domain/lsf, domain/normas, domain/seo, domain/steel-frame, domain/sustentabilidade
#project/  → frente: site, blog, linkedin, apresentacao, material, comercial
#status/   → ciclo: draft, active, review, published, archived, locked, stale
#ai/       → sinalização: context, memory, prompt, locked, do-not-edit, ai-generated
#source/   → origem: manual, brainstorm, pesquisa, dream, standup, wrap-up, hubspot, notion
```

**Decisão**: nomes E valores em inglês (`#status/published`, não `#status/publicado`). Conteúdo de notas continua pt-BR — só metadata é en.

## Locked notes

Notas com `locked: true` no frontmatter (toda `30-prompts/` exceto os criados por Claude) **NUNCA devem ser editadas sem permissão explícita do Bruno**.

Histórico: [[prompts-calibrados]].

Hook `validate-write` (futuro) bloqueará edits sem flag explícita.

## Naming conventions

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos | kebab-case lowercase | `perfil-bruno.md` |
| Pastas top-level | número-prefixed | `00-meta/`, `40-content/` |
| Subpastas | kebab-case | `40-content/blog/publicados/` |
| Wikilinks | alias para nomes longos | `[[drywall-st-ru-rf\|Drywall ST/RU/RF]]` |
| Frontmatter keys | snake_case | `seo_title`, `palavras_chave` |
| Tag values | kebab-case dentro de raiz | `#domain/steel-frame` |

## Padrão SKIM → GREP → READ TARGETED

**Sempre** começar com SKIM (auto via SessionStart hook):
1. `../CLAUDE.md` (projeto-level)
2. [[index]] (este vault)
3. [[10-memory/MEMORY]]

**Quando precisar de info específica** — GREP:
- `Grep "ai_summary:" Berkahn-Vault/` → TL;DRs de TODAS notas
- `Grep "termo" Berkahn-Vault/` → busca contextual
- `obsidian-cli search "termo"` → ranking + backlinks

**Após grep** — READ TARGETED:
- 2-4 notas com hit, não pasta inteira
- Wikilinks dentro guiam para detalhes

## Quando criar nota

| Situação | Onde |
|----------|------|
| Atomic note (1 conceito) | `70-knowledge/[conceito].md` |
| Draft blog | `40-content/blog/drafts/[slug].md` (use template `template-draft-blog`) |
| Ideia solta | `40-content/blog/ideias/ideas-YYYY-MM.md` (append) |
| Pesquisa de artigo | **não é nota** — vai no bloco Pesquisa da pauta, em `/admin/conteudo/[id]`. Ver [[quadro-conteudo]] |
| Post de LinkedIn | **não é nota** — bloco Texto Linkedin da pauta. `40-content/linkedin/` é acervo congelado |
| Reflexão consolidada (dream) | `~/.claude/projects/.../memory/` → revisar segunda → promover para `10-memory/` |
| Daily note | `00-meta/standup/YYYY-MM-DD.md` (via `/standup`) |

## Skills + ferramentas (token-efficient)

| Tool | Uso |
|------|-----|
| `Read`/`Write`/`Edit` | Default (zero overhead) |
| `Grep "ai_summary:"` | SKIM rápido de 100+ notas |
| `Bash` → `obsidian-cli search` | Ranking + backlinks |
| Skill `obsidian-markdown` | Sintaxe nativa (callouts, embeds) |
| Skill `obsidian-bases` | Editar `.base` files |

**NÃO USAR**: MCP `obsidian-claude-code-mcp` (10-40k tokens de schema, sem ganho real aqui).

## Encoding (Windows)

- Sempre usar `Write` tool (UTF-8 sem BOM por default)
- Se precisar PowerShell: `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))`
- `.gitattributes` já força `eol=lf` em `.md/.json/.canvas/.base`

## Cross-project guard

`vault-manifest.json` (raiz do projeto) declara `allowed_projects`. Hook SessionStart bloqueia carregamento do vault se `cwd` não estiver na lista — evita vazar contexto Berkahn em sessão de outro projeto (ex: Brada).

## Workflow semanal

Resumo em [[index]]. Detalhes em [[workflow-conteudo]] + 5 workflows específicos: [[workflow-site]] · [[workflow-seo]] · [[workflow-comercial]] · [[workflow-material]] · [[workflow-pesquisa]].

`/standup` (auto seg 9h via scheduled-task `berkahn-standup-semanal`) e `/wrap-up` (auto sex 17h via `berkahn-wrapup-semanal`) lêem 8 hubs + sprint-ativa e atualizam. Ambos rodam `node scripts/vault-validate.mjs` como sanity check final.

## 🚀 Hubs canônicos (8 first-class projetos)

`00-meta/projetos/{blog,linkedin,site,seo-aeo,apresentacoes,materiais,pesquisas,orcamento-automacao}.md` — cada um é nota first-class com KPIs (`kpi_*`), bloqueios, próximos 7 dias, contextos aplicados, workflow, prompts/bases/subagents relacionados. **Source of truth do estado do projeto**. Atualizados semanalmente via `/standup` e `/wrap-up`.

Tag `project/<nome>` segue 1:1 com nome do hub (`project/blog`, `project/linkedin`, `project/orcamento-automacao`, etc.).

## Subagents úteis por projeto

| Projeto | Subagents recomendados |
|---------|------------------------|
| [[blog]] | `@pragmatic-code-review` (review components/article/) |
| [[linkedin]] | — (outputs são markdown puro) |
| [[site]] | `@pragmatic-code-review`, `@design-review`, `@security-review` |
| [[seo-aeo]] | — (`/seo` cobre auditoria) |
| [[apresentacoes]] | `@design-review` (UI/UX em live env) |
| [[00-meta/projetos/materiais|materiais]] | `@design-review` (consistência brand) |
| [[pesquisas]] | — |
| [[orcamento-automacao]] | `@pragmatic-code-review`, `@design-review`, `@security-review` (admin + renderer PDF + gate HMAC) |

## Scripts vault (`scripts/vault-*.mjs`)

| Script | Uso |
|--------|-----|
| `vault-backfill-articles.mjs` | Normaliza frontmatter artigos publicados + rename slugs canonical |
| `vault-backfill-ai-summary.mjs` | Preenche ai_summary + rodapé wikilinks (idempotente via marker) |
| `vault-supabase-resync.mjs` | GET check ou PATCH meta tags Supabase (`$env:SUPABASE_SERVICE_KEY`) |
| `vault-validate.mjs` | Linter de completude (9 validações, exit 0/1/2, ANSI ou `--json`) |

Documentação: `scripts/VAULT-SCRIPTS-README.md`
