---
tipo: memory
subtipo: feedback
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/memory
  - ai/locked
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Prompts de conteúdo (LinkedIn, brainstorm, pesquisa, criação) foram calibrados por iteração e NÃO devem ser alterados sem permissão. Os de Bruno são intocáveis; os criados por Claude podem ser ajustados.
status: active
why: "Os prompts passaram por múltiplas rodadas de refinamento. Especialmente o de LinkedIn, com regras sobre vícios de linguagem, terminologia LSF vs Steel Frame, tom 'engenheiro experiente', extensão 100-180 palavras. Alterar sem entender o histórico degrada qualidade."
how_to_apply: "Ao usar prompt de 30-prompts/, executar fielmente. Se identificar melhoria, sugerir ao Bruno antes de aplicar. Distinguir prompts de Bruno vs prompts criados por Claude."
---

# Prompts de conteúdo são calibrados

Todos os prompts de conteúdo foram calibrados por iteração extensiva e NÃO devem ser alterados sem permissão explícita do Bruno. Cada regra tem razão de ser.

## Prompts de Bruno (intocáveis)

Vieram do Bruno e devem ser executados fielmente:
- [[linkedin-post]]
- [[blog-brainstorm]]
- [[blog-pesquisa]]
- [[blog-criacao]]

## Prompts criados por Claude (mais flexíveis)

Podem ser ajustados com mais liberdade:
- [[presentation-slide]]
- [[canva-briefing]]
- [[seo-page-audit]]

## Como sinalizar no vault

Notas com `locked: true` no frontmatter têm essa proteção. Hook `validate-write` (futuro) bloqueia edits sem flag explícita.
