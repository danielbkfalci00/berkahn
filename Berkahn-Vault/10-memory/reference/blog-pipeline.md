---
tipo: memory
criado: 2026-04-13
atualizado: 2026-05-21
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
| Scripts INSERT/UPDATE Supabase | `scripts/articles/add-article-*.mjs` (gitignored) |
| Capas (live, Next.js consome) | `public/images/blog/[slug]/cover.webp` |
| Outros assets blog (não capas) | `public/images/img_blog/` |
| Markdown publicado | `Berkahn-Vault/40-content/blog/publicados/` (após Fase 8) |

## Comando

```
/artigo Berkahn-Vault/40-content/blog/publicados/[slug].md
```

Lê o arquivo direto, sem precisar colar conteúdo.

## Dev server

Porta padrão: 3000 (pode variar 3001, 3002). Verificar log.

## Referências

- Workflow editorial: [[workflow-conteudo]]
- Pipeline técnico detalhado: [[article-pipeline]]
- Artigos publicados: [[artigos-publicados]]
