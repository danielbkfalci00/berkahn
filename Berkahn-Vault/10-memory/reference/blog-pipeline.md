---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-06
tags:
  - ai/memory
  - status/active
  - project/blog
ai_summary: Referências técnicas do blog Berkahn — slugs, placeholders de componentes, paths de scripts/capas/markdown. Comando /artigo lê markdown direto do path.
status: active
subtipo: reference
---

# Blog — Pipeline técnico

## URL

Slugs vivem em `/atualidades/{slug}`.

## Placeholders de componentes

No conteúdo markdown, componentes interativos são referenciados por placeholder:

- `[STATS:id]` — estatísticas
- `[TABLE:id]` — tabela
- `[CHART:id]` — gráfico
- `[NORMS:id]` — normas
- `[FAQ:id]` — perguntas
- `[CHECKLIST:id]` — checklist
- `[CTA:id]` — call to action
- `[IMAGE:id]` — imagem

## Paths

| Conteúdo | Path |
|----------|------|
| CLI de conteúdo | `scripts/conteudo/pauta.mjs` (versionado) |
| Capas (live, Next.js consome) | `public/images/img_blog/[slug]/cover.webp` |
| Outros assets blog (não capas) | `public/images/img_blog/` |
| Markdown publicado | `Berkahn-Vault/40-content/blog/publicados/` (após Fase 8) |

## Comando

```
/artigo produzir <pauta-id> Berkahn-Vault/40-content/blog/drafts/[slug].md
/artigo publicar <pauta-id>
```

Lê o arquivo direto, sem precisar colar conteúdo.

## Dev server

Porta padrão: 3000 (pode variar 3001, 3002). Verificar log.

## Referências

- Workflow editorial: [[workflow-conteudo]]
- Pipeline técnico detalhado: [[article-pipeline]]
- Artigos publicados: [[artigos-publicados]]
