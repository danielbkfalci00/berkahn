---
tipo: meta
criado: 2026-05-21
atualizado: 2026-09-16
tags:
  - status/active
ai_summary: Auditoria de mudanças estruturais do vault Berkahn. Append-only — toda decisão arquitetural significativa é registrada aqui.
status: active
---

# Vault CHANGELOG

Histórico de mudanças estruturais do vault. Append-only.

## 2026-09-16 — Calibragem narrativa do LinkedIn v1.4

- Feedback real da pauta `0197a729` virou regra no prompt locked, com autorização
  explícita: uma linha causal por post, sem reiniciar o tema em cada parágrafo
- CTA passou a continuar a decisão já construída no corpo; testes humanos de
  permutação e ponte foram incorporados ao `/conteudo` e `/linkedin`
- `check-linkedin.mjs` bloqueia as fórmulas “não veio apenas de...” e “há um
  detalhe que muda...”, e declara que saída verde não valida continuidade

## 2026-08-27 — Gate documental fail-closed

- `vault-validate.mjs` passou a rejeitar configuração inválida e flags
  desconhecidas, validar uma nota com `--single` e resolver wikilinks/anchors
- A ordem canônica voltou a ser carregada do Obsidian Linter; o JSON inválido
  que produzia falso verde foi corrigido
- Pendências operacionais foram consolidadas nos hubs, com MOC apenas como
  ponteiro/query; sprint histórica foi reduzida ao estado vigente
- Links legados de materiais, apresentação e conhecimento foram reconciliados
  com os índices atuais

## 2026-08-07 — Quadro observável e aprendizado editorial

- Migrations 021–023: view leve, mutações atômicas, heartbeat do worker,
  snapshots agregados de 28 dias e correção UTF-8 da taxonomia
- Visão Geral virou agenda; filtros persistem na URL e a listagem pagina 18 cards
- Analytics do admin foi excluído e o ciclo de recomendações permanece humano
- Verificador transacional cobre o schema 012–023; CI cobre código e build
- Documentação reconciliada em [[quadro-conteudo]], [[workflow-conteudo]] e
  [[analytics-methodology]]


## 2026-05-21 — Vault criado e populado

**Migração inicial** de fontes fragmentadas para single source of truth:

- Memória Claude (`~/.claude/projects/.../memory/`) → `10-memory/` (5 arquivos)
- Contexto (`.claude/context/`) → `20-context/` (6 arquivos)
- Prompts (`.claude/prompts/`) → `30-prompts/` (9 arquivos, sanitizados)
- Conteúdo blog publicado (`Docs/Conteúdo/publicados/blog/`) → `40-content/blog/publicados/` (35 artigos)
- Brand (`Docs/brand/GUIA-DESIGN-BERKAHN.md`) → `50-brand/guia-design-berkahn.md`
- Arquitetura (`Docs/site/`, `Docs/integracoes/`) → `60-arquitetura/`
- Adicionado: 4 Bases, 5 Templater templates, Linter config, index.md, CLAUDE.md vault-level
- Hooks: estendido session-start.ts, validate-write.ts, registrado dream Stop hook (planejado)

**Decisões estruturais**:
- Estrutura Johnny-Decimal-lite (12 pastas, 2 níveis máx)
- Frontmatter flat com `ai_summary` obrigatório
- Tag taxonomy 5 raízes em inglês (#domain/, #project/, #status/, #ai/, #source/)
- Naming kebab-case lowercase
- Acesso via filesystem + obsidian-cli (sem MCP)

**Segurança**:
- Supabase service_role key rotacionada e sanitizada
- 2 GitHub PATs revogados
- gitleaks pre-commit hook ativo
- `.gitleaks.toml` allowlist para placeholders

**Bug fix cross-project**:
- Removido `Brada/HubSpot` e `Brada/Meetings/atas` de `additionalDirectories` no `~/.claude/settings.json` global

## 2026-10-21 — Sessão de conteúdo, calendário e Perfil no Google

- Relatórios de agosto a outubro, diagnóstico da queda de tráfego e reedição de rascunhos (notas em `40-content/auditorias-seo/`).
- Prompt `blog-criacao` v1.1 (público médio e grande porte, sem claims de obra entregue).
- 4 artigos publicados e 33 revisados em linguagem de oferta; LinkedIn com a mesma data do blog.
- Guia e estado do Perfil da Empresa no Google em [[google-perfil-empresa]].
