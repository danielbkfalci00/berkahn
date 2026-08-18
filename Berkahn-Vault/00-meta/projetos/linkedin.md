---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-18
tags:
  - project/linkedin
  - status/active
ai_summary: Hub do LinkedIn. Duas pautas aprovadas aguardam publicação manual e registro de URL+data, a de casa LSF 100 m² e a de custos ocultos. Cadência segue abaixo da meta.
status: active
projeto: linkedin
kpi_publicados: 3
kpi_meta_publicados_semanal: 1
kpi_engajamento_medio: 0
kpi_artigos_linkados: 0
kpi_atualizado_em: 2026-07-29
contextos_aplicados:
  - berkahn-brand
  - copy-sem-travessao
  - perfil-bruno
workflow: workflow-conteudo
prompts_relacionados:
  - linkedin-post
  - canva-briefing
bases_relacionadas:
  - calendario
  - kpis
subagents_uteis: []
---

# LinkedIn — Projeto

> Hub do projeto LinkedIn. Posts semanais de divulgação. Lê do blog (gera post + briefing imagem).

## Status atual

Pipeline centralizado no [[quadro-conteudo]]: 66 trilhas LinkedIn, sendo 44 das
pautas editoriais e 22 do acervo. O texto e os insumos visuais não são mais
copiados para Notion nem para novas pastas do vault. Bruno continua publicando
manualmente no LinkedIn; o chip de status é livre, mas somente URL e data comprovam a publicação real.

As quatro pastas em `40-content/linkedin/` são legado imutável. A pasta de ICMS
foi reconciliada no banco sem apagar os arquivos.

Contagem verificada em 2026-07-29 contra `main` — o `kpi_publicados: 1` anterior estava parado desde maio.

## Bloqueios ativos

- [ ] **Cadência abaixo da meta**: 3 posts arquivados vs 38 artigos do blog — só ~8% dos artigos viraram post
- [x] ~~**Rastreamento bidirecional inexiste**~~ — resolvido em 2026-08-06 pelo quadro de conteúdo. Não era caso de backfill de frontmatter: a pauta tem `post_id` como FK de verdade, então o vínculo post ↔ artigo é uma constraint, não uma convenção que alguém precisa lembrar de preencher. Os 22 cards de LinkedIn do acervo já nascem vinculados. Ver [[quadro-conteudo]]
- [ ] **Engajamento não tracked**: sem captura de métricas (likes, comments, reach)

## Próximos 7 dias

- [x] Texto, prompt e briefing da pauta de casa LSF de 100 m² gravados no card
- [x] Imagem 4:5 gerada e validada em 1080×1350
- [x] Imagem 1080×1350 enviada ao Storage e vinculada ao card
- [x] Copy revisada em 12/08: 125 palavras, hook em situação real e CTA para checklist; aprendizado incorporado em [[linkedin-post]] v1.1
- [x] Aprovação editorial registrada no card
- [ ] @bruno Publicar manualmente no LinkedIn com a UTM entregue; depois registrar URL e data reais #pendencia
- [x] Pauta `d29d7fee` (custos ocultos) aprovada em 18/08 com copy de 142 palavras e capa 1080×1350
- [ ] @bruno Publicar o post de custos ocultos e registrar URL e data reais no card `d29d7fee` #pendencia

- [ ] Começar o backlog de distribuição: 22 posts derivam de artigos **já publicados** e não exigem escrever artigo nenhum

> [!note] Imagem sem texto foi exceção deliberada
> A capa da pauta `d29d7fee` é a mesma foto do Blog recortada para 4:5, sem
> tipografia sobreposta, contrariando o padrão de [[linkedin-post]]. A foto é de
> obra real e carrega o argumento sozinha; sobrepor os percentuais do CUB
> repetiria na imagem o empilhamento de números que já tinha sido cortado do
> texto. Sem foto própria que sustente o argumento, voltar ao padrão com
> tipografia. Registrado no bloco `imagem-briefing` do card.

## Backlog planejado (2026-07-29)

44 briefings até dezembro em [[2026-08-calendario-editorial]], em duas fontes:

- **22 derivados** das pautas Core da semana, um por semana
- **22 do acervo**: artigos já no ar que nunca viraram post. Hoje só 3 dos 38 têm post correspondente

Cada post recebe `artigo_slug` no frontmatter, fechando o rastreamento bidirecional que hoje não existe. O texto final sai de `/linkedin`; o calendário entrega ângulo, dado-âncora e artigo de origem, não o post pronto.

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts arquivados (total) | 1 | 1 (semana) | 0 |
| Artigos com post LinkedIn | 0 | 35 (retroativo) | -35 |
| Engajamento médio | n/d | a definir | — |

## Contexto aplicado

- [[berkahn-brand]] — voz, ICP, gancho profissional
- [[copy-sem-travessao]] — regra de copy aplicada
- [[perfil-bruno]] — perfil pessoal Bruno (publicação manual)

## Workflow & prompts

- Workflow: [[workflow-conteudo]] — LinkedIn como sub-pipeline após blog
- Prompts (LOCKED): [[linkedin-post]] · [[canva-briefing]]
- Outputs novos em: blocos da pauta no `/admin/conteudo`; `40-content/linkedin/` é legado congelado e não recebe novas pastas

## Bases relacionadas

- [[calendario.base]] — pipeline + próximos 30 dias (inclui LinkedIn)
- [[kpis.base]] — agrega `kpi_*` (criada em Sprint 3)

## Subagents úteis

- (nenhum específico — outputs são markdown + briefing texto)

## Materiais de apoio

- [[indices-materiais-marketing]] — peças visuais finalizadas de LinkedIn no banco de imagens
- [[indices-capas-blog]] — capas que podem ser reutilizadas

## Histórico recente

- 2026-05-22: hub criado
- 2026-04-13: primeiro post arquivado (Medstar — Gestão de Obra)
