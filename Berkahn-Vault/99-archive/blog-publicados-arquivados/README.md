---
tipo: meta
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/blog
  - status/archived
ai_summary: Arquivo de artigos publicados removidos do fluxo ativo durante triagem Sprint 2.0a — drafts incompletos e versões duplicadas. Mantidos para referência histórica e auditoria de decisões editoriais.
status: archived
---

# Arquivo — Artigos Publicados Arquivados

> Arquivos movidos de `40-content/blog/publicados/` durante triagem Sprint 2 (2026-05-22). Mantidos para histórico, não voltam ao fluxo ativo sem decisão explícita.

## Critérios de arquivamento

1. **Draft com placeholders editoriais** (não finalizado para publicação)
2. **Versão duplicada/superseded** de artigo ainda ativo
3. **Off-topic confirmado** sem conexão com domínio Berkahn

## Artigos arquivados

### `tendencias-modular-2025-draft.md`
- **Original**: `tendencias_construção_modular_2025.md`
- **Razão**: Possui `[SUGESTÃO DE IMAGEM]`, `[SUGESTÃO DE GRÁFICO]`, `[SUGESTÃO DE TABELA VISUAL]`, `[SUGESTÃO DE INFOGRÁFICO]` no corpo + grande seção final "Elementos visuais recomendados para o artigo" = briefing/draft de planejamento editorial, NÃO artigo final para publicação
- **Conteúdo**: Excelente (estatísticas mercado modular, casos Edifício Level + hospitais COVID + SteelCorp RS, ~2.500 palavras) — vale re-trabalhar via `/criacao` para finalizar como artigo publicável real
- **Próxima ação possível**: Bruno pode rodar `/criacao` com este conteúdo para gerar versão final, ou descartar definitivamente
- **Capa relacionada (órfã)**: nenhuma identificada nas 22 catalogadas em [[indices-capas-blog]]

### `steel-frame-revolucao-sustentavel-duplicate.md`
- **Original**: `Steel Frame a revolução sustentável que está transformando a construção brasileira.md`
- **Razão**: **DUPLICATA** confirmada de `steel_frame_o_futuro da construção civil.md` (canonical: `steel-frame-futuro-construcao.md`). Conteúdo idêntico (mesmo título, mesmo lead, mesmo desenvolvimento) — só nomes de arquivo diferentes
- **Detecção**: durante Sprint 2.1 backfill, ambos mapeados para slug `steel-frame-futuro-construcao` causando conflito. Diff confirmou conteúdo idêntico
- **Mantido em produção**: `steel-frame-futuro-construcao.md` (slug existe em Supabase via `scripts/run-sprint4.mjs`)

### `artigo-medstar-georgetown-v2025-superseded.md`
- **Original**: `artigo-medstar-georgetown (2).md` (date 2025-03-03)
- **Razão**: **DUPLICATA** de `artigo-construir-hospital-em-operacao.md` (date 2026-04-22, mais recente)
- **Diferenças**:
  - Datas: 2025-03-03 vs 2026-04-22 (versão mais nova prevaleceu)
  - Linha 14: redação ligeiramente diferente ("entregam ganhos claros de eficiência" vs "não são apenas eficientes, são mais seguros")
  - Linha 91: "Conclusão" levemente reescrita
- **Mantido por**: rastreabilidade da evolução do artigo + caso o LinkedIn original (2026-04-13-medstar-gestao-obra) tenha sido escrito baseado nesta versão
- **Cross-reference**: Post LinkedIn `40-content/linkedin/2026-04-13-medstar-gestao-obra/` linka para o tema (Medstar/Georgetown) → durante Sprint 2.4 bidirecional, o post deve linkar para [[artigo-construir-hospital-em-operacao]] (versão final), não esta superseded

## Restauração

Se quiser restaurar um arquivo ao fluxo ativo: `git mv <archive>/<arquivo>.md <40-content/blog/publicados>/<novo-slug>.md` e seguir Sprint 2.1 backfill normalmente.
