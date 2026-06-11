---
tipo: indice
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/blog
  - project/material
  - status/active
  - source/manual
ai_summary: Índice de 22 capas de blog em Docs/Conteúdo/Capas blog/ — capas exportadas do Canva. Capa em produção fica em public/images/img_blog/[slug]/cover.webp (versão final). Mapping artigo↔capa validado após Sprint 2.1 backfill. 4 capas órfãs (sem artigo) + 3 pares duplicadas para consolidar.
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - blog
path_externo: "../../../../Docs/Conteúdo/Capas blog/"
arquivos_total: 22
arquivos_mapeados: 15
arquivos_orfaos: 4
arquivos_duplicados: 3
---

# Índice — Capas Blog (Docs/Conteúdo/Capas blog/)

> **Hubs relacionados**: [[blog]] · [[materiais]]
> **Localização externa**: `Docs/Conteúdo/Capas blog/` (22 arquivos, exportações Canva).
> **Capas em produção**: `public/images/img_blog/[slug]/cover.webp` (consumidas pelo Next.js).

## Catálogo validado — mapping arquivo → artigo

| Arquivo | Tipo | Artigo (slug canonical) | Status |
|---------|------|--------------------------|--------|
| `Engenheiros testam.png` | PNG | [[steel-frame-terremoto-teste-cfs10]] | ✓ |
| `Fundação para Steel Frame.png` | PNG | [[fundacao-steel-frame]] | ✓ |
| `alvenaria_bloco_vedação_drywall.png` | PNG | [[drywall-st-ru-rf]] ou [[drywall-ou-alvenaria]] | ⚠️ validar qual |
| `drywall_st_ru.png` | PNG | [[drywall-st-ru-rf]] | ✓ |
| `evitar_patologias.png` | PNG | [[patologias-steel-frame]] | ✓ |
| `financiamento.webp` | WEBP | [[financiamento-construcao-steel-frame]] | ✓ |
| `fogo afeta estrutura.png` | PNG | [[steel-frame-fogo-incendio]] | ⚠️ duplicado (consolidar com fogo.webp) |
| `fogo.webp` | WEBP | [[steel-frame-fogo-incendio]] | ✓ canonical |
| `georgetown.png` | PNG | [[construir-hospital-em-operacao]] | ⚠️ duplicado (consolidar com georgetown_2.webp) |
| `georgetown_2.webp` | WEBP | [[construir-hospital-em-operacao]] | ✓ canonical |
| `lsf_alvenaria.png` | PNG | [[steel-frame-vs-alvenaria]] | ✓ |
| `lsf_mundial.png` | PNG | [[steel-frame-no-mundo]] | ⚠️ duplicado (consolidar com .webp) |
| `lsf_mundial.webp` | WEBP | [[steel-frame-no-mundo]] | ✓ canonical |
| `mito_verdade_lsf.png` | PNG | [[mitos-verdades-steel-frame]] | ✓ |
| `normas_lsf.png` | PNG | [[certificacoes-steel-frame]] ou [[normas-lsf]] | ⚠️ validar qual |
| `patologias_sistema.png` | PNG | [[patologias-steel-frame]] | ✓ |
| `proteção contra queda.png` | PNG | [[protecao-contra-quedas-construcao-civil]] | ✓ |
| `vantagesn_desnavantens_lsf.png` | PNG (typo) | [[steel-frame-vantagens-desvantagens]] | ✓ |

## Capas órfãs (sem artigo correspondente)

Decidir com Bruno: descartar, criar artigo, ou re-purpor para outro uso.

| Arquivo | Tema | Possível artigo futuro |
|---------|------|------------------------|
| `Reestruturando o Concreto.jpg` | Concreto / estrutural | ? — sair do escopo LSF |
| `energia_solar.png` | Energia fotovoltaica | Conexão com `lsf-sustentabilidade`? Artigo: "Solar + LSF" futuro |
| `mármore.png` | Material premium | Artigo: "Mármore em LSF: instalação e cuidados" futuro |
| `piscina_arraia.png` | Piscina em projeto | Caso/projeto residencial específico (sem artigo) |

## Pares duplicados (PNG + WEBP — consolidar)

Manter sempre o `.webp` (otimizado para web). Mover `.png` para `99-archive/blog-publicados-arquivados/capas-png-legacy/` ou apenas deletar (decidir Bruno).

| PNG (deletar) | WEBP canonical (manter) |
|---------------|--------------------------|
| `lsf_mundial.png` | `lsf_mundial.webp` |
| `fogo.png` + `fogo afeta estrutura.png` | `fogo.webp` |
| `georgetown.png` | `georgetown_2.webp` (mas observar: `construir-hospital-em-operacao.md` aponta para `georgetown.png` — atualizar `material_visual_slug` para `.webp` se consolidar) |

## Artigos SEM capa correspondente

Recomendação: rodar `/material` para gerar briefing Canva da capa faltante.

| Artigo (slug) | Tema | Sugestão briefing |
|---------------|------|--------------------|
| [[hold-downs-ancoragens]] | Ancoragens estruturais LSF | Diagrama isométrico de hold-down + parede LSF |
| [[5-vantagens-decisivas-light-steel-frame]] | Genérico LSF | Infográfico 5 ícones (velocidade, precisão, sustentabilidade, etc.) |
| [[passo-passo-construcao-steel-frame]] | Pipeline 4 etapas | Timeline visual das etapas |
| [[orcamento-steel-frame]] | Custos LSF | Gráfico R$/m² por região |
| [[isolamento-termico-acustico-steel-frame]] | Isolamento | Diagrama 6 camadas parede LSF |
| [[construir-ou-comprar-pronto-numeros-grande-sp]] | Custos comparativo | Comparativo visual: construir vs comprar |
| [[normas-light-steel-frame-brasil]] | Normas | Selo ABNT + lista normas |
| [[financiar-construcao-light-steel-frame]] | Financiamento | Tabela bancos + condições |
| [[alvenaria-vs-drywall]] | Drywall vs alvenaria | Side-by-side parede aberta |
| [[berkahn-reforma-construcao-industrializada]] | Editorial Berkahn | Logo + tagline + visual brand |
| [[guia-definitivo-steel-frame-brasil]] | Guia completo | Capa principal com logo + título |
| [[iluminacao-led-residencial]] | LED + LSF | Render ambiente com luz embutida |
| [[mitos-verdades-steel-frame]] | Mitos LSF | Ícones X/✓ visuais |
| [[steel-frame-futuro-construcao]] | Editorial LSF | Imagem inspiracional + dado de mercado |

## Quando usar

- Backfill bidirecional (já parcialmente feito Sprint 2.4): adicionar `material_visual_slug:` no frontmatter de cada artigo apontando para arquivo da capa
- Reutilizar capas em apresentações ou peças LinkedIn
- Substituir capa em produção via Canva (referência visual histórica)

## Como ler binários

```bash
ls "../../../../Docs/Conteúdo/Capas blog/"
```

## Manutenção

- ✅ Mapping artigo↔capa validado Sprint 2.4 (15 confirmados, 4 órfãos, 3 duplicatas)
- ⚠️ Padronizar nomenclatura: nova capa = `[slug-do-artigo].webp` (kebab-case sem espaços/typos)
- ⚠️ Corrigir typo histórico: `vantagesn_desnavantens_lsf.png` → renomear para `steel-frame-vantagens-desvantagens.webp` (Bruno decide se mantém)
- Sempre exportar `.webp` (não `.png`) para web — Canva tem export WebP nativo
