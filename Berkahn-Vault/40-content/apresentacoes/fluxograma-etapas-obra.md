---
tipo: apresentacao
criado: 2026-06-10
atualizado: 2026-06-11
tags:
  - project/apresentacao
  - project/site
  - status/active
  - source/manual
  - domain/lsf
ai_summary: Fluxograma "Etapas da Obra" — versão React canônica em components/fluxograma/ servindo a página /etapas-da-obra (limpa, noindex, para envio a clientes) e o card expansível no slide 3 da /apresentacao-executiva. 6 fases, 2 loops de decisão, 3 marcos de orçamento em preto sobre trilho lateral. HTML em Docs/ é artefato v1 de referência.
status: active
projeto: apresentacoes
url_final: /etapas-da-obra
projetos_relacionados:
  - apresentacoes
  - site
path_externo: ../../../Docs/fluxograma-etapas-obra.html
---

# Fluxograma — Etapas da Obra

> [!info] Fonte canônica (v2, 2026-06-11): **versão React** em `components/fluxograma/` + `lib/etapas-obra-data.ts`. O HTML em `Docs/fluxograma-etapas-obra.html` é o artefato v1 de referência visual — qualquer mudança de conteúdo deve ser feita em `lib/etapas-obra-data.ts`.

**Superfícies em produção (v2)**:
1. **Página própria `/etapas-da-obra`** — limpa (sem Header/Footer do site, excluída em ClientLayout/ConditionalFooter/WhatsAppButton), `robots: noindex` + disallow em robots.ts, OG image para link preview no WhatsApp, CTA "Falar com a Berkahn" no footer, print-friendly. Para envio direto a clientes.
2. **Card expansível no slide 3** ("Do Conceito à Entrega das Chaves") da `/apresentacao-executiva` — `SlideMethodology.tsx`, expande inline com animação de altura (motion), chunk lazy via `next/dynamic`, botão "Recolher" no fim do painel.

**Artefato v1**: `Docs/fluxograma-etapas-obra.html` — HTML único e portátil (47 KB, logo embutido em base64, abre com duplo clique, funciona por WhatsApp/email). Redesenho do rascunho do time dentro da identidade [[guia-design-berkahn]].

## Conteúdo (estrutura fiel ao rascunho do time)

| Fase | Conteúdo | Marco lateral |
|------|----------|---------------|
| 01 — Compra do Terreno e avaliação inicial | Compra do Terreno → Estudo Geotécnico e Levantamento Topográfico | — |
| 02 — Contratação do Arquiteto e Desenho inicial | Contratação Arquiteto → Anteprojeto → Contratação Projetista → Proj. Preliminar de Estrutura → Projeto Legal (Prefeitura) → decisão **Reprovado?** (Sim volta) | **Orçamento Estimado** |
| 03 — Projetos Preliminares | 4 caixas (Arquitetura, Estrutural, Instalações, Complementares c/ "HVAC, imp., paisag...") | **Orçamento Preliminar** |
| 04 — Projetos Pré-Executivos | 4 caixas | — |
| 05 — Projetos Executivos | 4 caixas → Compatibilização → decisão **Conflitos?** (Sim volta) | **Orçamento Analítico** |
| 06 — Projeto Compatibilizado | Mobilização e Início da Obra | — |

Eixo lateral direito: trilho vertical com seta ↑ e caption "Precisão do Orçamento" (semântica das setas amarelas do original).

## Decisões de design (Bruno, 2026-06-10)

1. **Typos corrigidos** (sem toggle): Geotécno→Geotécnico, Antiprojeto→Anteprojeto, Pre→Pré-Executivo, caixas da Fase 05 Preliminar→Executivo, segunda "Fase 05"→Fase 06.
2. **Marcos de orçamento em preto sólido** (cards pretos invertidos) no lugar do amarelo do rascunho — acento máximo dentro da paleta P&B da marca.
3. **Fundo off-white `#F4F2EC`** com grade sutil de prancheta técnica.

Demais escolhas: Manrope 300–800, cards brancos com shadow-luxury, loops de retorno em tracejado com chips Sim/Não, ghost numbers editoriais por fase, fade-up via IntersectionObserver (respeitando `prefers-reduced-motion`), CSS de print (A4, fundo branco, `break-inside: avoid`).

## Status / próximos passos

- [x] Validar v1 com o time (enviar o HTML ou abrir no navegador)
- [x] Decidir destino final: **ambos** — card expansível no slide 3 + URL própria (decisão Bruno, 2026-06-11)
- [x] v2 React implementada: página `/etapas-da-obra` + card no `SlideMethodology.tsx` (componente compartilhado `components/fluxograma/`)
- [ ] Validar v2 com o time e coletar feedback
- [ ] Deploy (merge na main → Vercel) e enviar URL de produção ao time

Hub: [[apresentacoes]] · Workflow: [[workflow-comercial]]
