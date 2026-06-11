---
tipo: memory
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/site
ai_summary: Workflow do projeto Pesquisas — tema → fontes → síntese → atomic notes reutilizáveis (70-knowledge/). Cross-projeto. Saídas: blog (/pesquisa raw), competitor research, pesquisa de mercado, pesquisa SEO/AEO. Gap crítico atual:  70-knowledge vazio — pesquisas não destilam em atomic notes.
status: active
subtipo: project
why: "Cada nova pesquisa hoje re-explora terreno já coberto (LSF normas, custos, fogo, acústica). Destilação em atomic notes (70-knowledge/) permite reutilização entre artigos e elimina re-trabalho. Source of truth para domínio Berkahn."
how_to_apply: "Pesquisa nova → /pesquisa (raw em 40-content/blog/pesquisa/) → /criacao consome → APÓS uso, extrair conceitos centrais para atomic notes em 70-knowledge/ com frontmatter usado_em + origem_pesquisa. Próxima pesquisa busca atomic notes antes."
---

# Workflow do projeto Pesquisas

> Hub: [[pesquisas]] · Domínio: [[steel-frame-domain]] · SEO context: [[seo-aeo-strategy]]

## Pipeline

```
1. Identificação de tema/lacuna
   ├─ Demanda do blog (/brainstorm gerou ideia)
   ├─ Demanda comercial (prospect perguntou algo não documentado)
   ├─ Demanda competitiva (novo concorrente, novo produto LSF)
   └─ Demanda estratégica (SEO/AEO, mudança de algoritmo)
       ↓
2. Pesquisa raw
   ├─ Para blog: /pesquisa → 40-content/blog/pesquisa/YYYY-MM-DD-tema.md
   ├─ Para competitor: 40-content/pesquisa-mercado/competitor-research/<name>-snapshot.md
   ├─ Para mercado: 40-content/pesquisa-mercado/<tema>.md
   └─ Para SEO/AEO: 40-content/auditorias-seo/research-<tema>.md
       ↓
3. Consumo direto
   ├─ Blog: /criacao usa pesquisa raw → artigo final em /publicados/
   ├─ Apresentação: dados puxados para slides
   └─ Site: copy puxado para páginas
       ↓
4. ★ DESTILAÇÃO em atomic notes (GAP atual — Sprint 2.2 resolve)
   ├─ Identificar conceitos centrais reutilizáveis
   ├─ Criar nota em 70-knowledge/<conceito>.md (1 conceito por nota)
   ├─ Frontmatter: tipo: atomic, domain/lsf, ai_summary, usado_em: [], origem_pesquisa: <slug>
   └─ Wikilinks: [[steel-frame-domain]] (contexto pai)
       ↓
5. Reutilização
   ├─ Próxima pesquisa busca atomic notes ANTES de re-pesquisar
   ├─ Novos artigos linkam para atomic notes existentes
   └─ Atomic note acumula `usado_em` ao longo do tempo
```

## Etapas

### 1. Identificação
- Inputs: backlog blog ([[calendario.base]]), demandas comerciais ad-hoc, alertas competitivos, gaps SEO
- Validar: tema já tem atomic note? Já tem pesquisa raw recente? Não duplicar.

### 2. Pesquisa raw — escolher saída
- **Blog**: `/pesquisa <tema>` (LOCKED prompt em [[blog-pesquisa]])
  - Output: `40-content/blog/pesquisa/YYYY-MM-DD-tema.md`
- **Competitor**: capturar accessibility tree, screenshots, snapshots de páginas
  - Output: `40-content/pesquisa-mercado/competitor-research/<empresa>-snapshot.md` (ver [[stalart-snapshot]] como exemplo)
- **Mercado** (sales/comercial): pesquisa estruturada de mercado, benchmarks, dados
  - Output: `40-content/pesquisa-mercado/<tema>.md` (ver [[guia-orcamento]] como exemplo)
- **SEO/AEO**: pesquisa de fundamentos, novas práticas, algoritmo updates
  - Output: `40-content/auditorias-seo/research-<tema>.md` (ver [[research-seo-aeo]])

### 3. Consumo
- Pesquisa raw é input direto para outputs (artigo, slide, copy site)
- Documentar quais outputs usaram em frontmatter `consumido_por:`

### 4. Destilação em atomic notes (Sprint 2.2)
- Após uso da pesquisa raw, identificar 1-3 conceitos centrais
- Para cada conceito: criar `70-knowledge/<conceito>.md` usando [[template-atomic]]
- Frontmatter padrão:
  ```yaml
  tipo: atomic
  tags: [ai/context, status/active, domain/lsf]
  ai_summary: <1 linha>
  status: active
  usado_em: [<slugs de artigos>]
  origem_pesquisa: <slug da pesquisa raw>
  ```
- Wikilinks: linkar para [[steel-frame-domain]] (contexto pai) e para artigos que usam

### 5. Reutilização
- Antes de nova pesquisa, buscar em [[conhecimento.base]] (Sprint 3) por atomic notes existentes
- Linkar nova pesquisa raw para atomic notes referenciadas
- Atualizar `usado_em` nas atomic notes quando usadas

## Prompts e bases

- Slash: `/pesquisa` (LOCKED prompt em [[blog-pesquisa]])
- Slash: `/brainstorm` (gera ideias, alimenta /pesquisa)
- Bases consumidas: [[conhecimento.base]] (após Sprint 3) — verificar atomic notes antes
- Bases atualizadas: [[conhecimento.base]] após criar atomic notes

## Outputs típicos

- Pesquisa raw em `40-content/blog/pesquisa/`, `40-content/pesquisa-mercado/`, ou `40-content/auditorias-seo/`
- Atomic notes em `70-knowledge/<conceito>.md`
- Update do hub [[pesquisas]] (kpi_atomic_notes_geradas)
- Update de [[steel-frame-domain]] com novos wikilinks para atomic notes criadas

## Subagents úteis

- (nenhum subagent específico)

## Atomic notes planejadas (Sprint 2.2)

Conceitos LSF recorrentes que aparecem em múltiplos artigos:
- [[lsf-normas-nbr]] (NBR 16970, 14762, 15253)
- [[lsf-custos]] (faixa preço m², SINAPI)
- [[lsf-cronograma]] (timeline típico)
- [[lsf-fogo]] (resistência ao fogo, NBR 14432)
- [[lsf-acustica]] (desempenho acústico)
- [[lsf-financiamento]] (Caixa, bancos)
- [[lsf-vs-alvenaria]] (comparativo)
- [[lsf-fundacao]] (tipos de fundação para LSF)
- [[lsf-sustentabilidade]] (economia circular)
- [[lsf-versatilidade-arquitetonica]]

## Gap atual

- 70-knowledge/ está VAZIO — Sprint 2.2 popula
- Pesquisas brutas existem mas não consolidadas em atomic notes
- [[stalart-snapshot]] é único competitor catalogado (meta: 5)
- Sem rastreamento `usado_em` em pesquisas existentes (backfill durante Sprint 2)
