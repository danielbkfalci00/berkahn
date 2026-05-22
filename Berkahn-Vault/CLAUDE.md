---
tipo: meta
criado: 2026-05-21
atualizado: 2026-05-21
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
tipo: memory | prompt | context | atomic | draft-content | meta
criado: YYYY-MM-DD
atualizado: YYYY-MM-DD
tags: [domain/X, status/Y]
ai_summary: TL;DR 1-3 linhas para Claude fazer grep+skim.
status: draft | active | archived | locked
---
```

Campos extras por tipo (memory, prompt, context, draft-content) em [[10-memory/MEMORY|MEMORY]] e exemplos nos templates `91-templates/`.

**Regras**:
- **Flat sempre** — nunca aninhar (`seo: {title: ...}` quebra Properties + Bases). Use prefixos: `seo_title`, `seo_description`.
- `ai_summary` em **toda** nota — habilita SKIM via grep.
- Linter plugin padroniza automaticamente (config em `.obsidian/plugins/obsidian-linter/data.json`).

## Tag taxonomy (5 raízes, inglês)

```
#domain/   → assunto técnico: steel-frame, lsf, drywall, normas, sustentabilidade, brand, architecture, integrations
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
| Pesquisa | `40-content/blog/pesquisa/YYYY-MM-DD-tema.md` |
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

Resumo em [[index]]. Detalhes em [[workflow-conteudo]].
