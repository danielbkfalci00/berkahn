---
description: Ver e planejar calendario de conteudo semanal
---

Use `/admin/conteudo` como pipeline operacional. Leia
`Berkahn-Vault/80-bases/calendario.base` somente como visão histórica do
acervo do vault; ela não determina o status atual das pautas.

Leia também:
- `Berkahn-Vault/20-context/berkahn-brand.md` — para contexto
- `Berkahn-Vault/20-context/seo-aeo-strategy.md` — para prioridades SEO
- `Berkahn-Vault/10-memory/reference/artigos-publicados.md` — registro local
- `Berkahn-Vault/10-memory/project/workflow-conteudo.md` — cadência semanal

Mostre o estado atual do pipeline a partir das trilhas Blog e LinkedIn do quadro:
1. **Artigos publicados recentemente** — listar do `40-content/blog/publicados/` ordenado por `publicado_em` (mais recentes primeiro)
2. **Drafts em andamento** — listar do `40-content/blog/drafts/` (status: draft)
3. **Ideias do mês** — listar de `40-content/blog/ideias/ideas-[YYYY-MM].md`
4. **Posts LinkedIn pendentes** — pautas cuja trilha LinkedIn não está
   `publicado`. Use `node scripts/conteudo/pauta.mjs ver <id>` para detalhes.
   **Não conte pastas em `40-content/linkedin/`**: são legado congelado.
5. **Ações SEO pendentes** — auditorias em `40-content/auditorias-seo/` que sinalizam P0/P1

Ajude o usuário a planejar a semana:
- Sugerir próximo artigo baseado em prioridade SEO + ideias acumuladas
- Lembrar de criar post LinkedIn para artigo recente
- Identificar gaps no calendário (semanas sem publicação)

$ARGUMENTS
