---
tipo: indice
criado: 2026-07-01
atualizado: 2026-09-10
tags:
  - project/materiais
  - status/active
  - source/manual
  - domain/brand
ai_summary: "Índice da categoria capas-blog — 162 arquivos em Docs/banco-imagens/capas-blog/. O lote 20-pautas-2026-09 reúne cinco cenários, uma seleção e um recorte LinkedIn por pauta; as 20 seleções já estão no staging do quadro e em public/images para o Blog."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - blog
path_externo: "../../../../Docs/banco-imagens/capas-blog/"
arquivos_total: 162
arquivos_mapeados: 158
arquivos_orfaos: 4
arquivos_duplicados: 21
---

# Índice — Capas Blog

> **Localização externa**: `../../../../Docs/banco-imagens/capas-blog/` (162 arquivos).
> **Capa em produção**: versão final vive em `public/images/...` (consumida pelo Next.js). Este banco é o arquivo-fonte/histórico.

## Lote 20 pautas — setembro de 2026

`20-pautas-2026-09/<tema>/` contém cinco cenários gerados, `selected.webp` e
`linkedin-1080x1350.webp`. Em 10/09, os 140 PNGs do lote foram normalizados em
WebP para reduzir o peso do repositório; as 20 seleções também foram convertidas em WebP
1200×800 em `public/images/img_blog/<slug>/cover.webp`; Blog e LinkedIn também
receberam suas versões no staging do card. O arquivo `selected.png` duplica de
propósito o cenário escolhido: um nome estável evita depender do número da
variação nas automações.

## Catálogo — capa → artigo

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `engenheiros-testam.png` | [[steel-frame-terremoto-teste-cfs10]] | |
| `fundacao-para-steel-frame.png` | [[fundacao-steel-frame]] | |
| `alvenaria-bloco-vedacao-drywall.png` | [[drywall-st-ru-rf]] / [[drywall-ou-alvenaria]] | validar qual artigo |
| `drywall-st-ru.png` | [[drywall-st-ru-rf]] | |
| `evitar-patologias.png` | [[patologias-steel-frame]] | |
| `patologias-sistema.png` | [[patologias-steel-frame]] | variante alternativa |
| `financiamento.webp` | [[financiamento-construcao-steel-frame]] | já em produção → `public/images/blog/financiar-construcao-light-steel-frame/cover.webp` |
| `fogo.webp` | [[steel-frame-fogo-incendio]] | canonical; já em produção → `public/images/Lsf/Layers/placa-de-gesso.webp` |
| `fogo-afeta-estrutura.png` | [[steel-frame-fogo-incendio]] | par PNG de `fogo.webp` (consolidar) |
| `georgetown-2.webp` | [[construir-hospital-em-operacao]] | canonical WEBP |
| `georgetown.png` | [[construir-hospital-em-operacao]] | par PNG de `georgetown-2.webp` (consolidar) |
| `lsf-alvenaria.png` | [[steel-frame-vs-alvenaria]] | |
| `lsf-mundial.webp` | [[40-content/blog/publicados/steel-frame-no-mundo|steel-frame-no-mundo]] | canonical; já em produção → `public/images/blog/steel-frame-no-mundo/cover.webp` |
| `lsf-mundial.png` | [[40-content/blog/publicados/steel-frame-no-mundo|steel-frame-no-mundo]] | par PNG de `lsf-mundial.webp` (consolidar) |
| `mito-verdade-lsf.png` | [[mitos-verdades-steel-frame]] | |
| `normas-lsf.png` | [[certificacoes-steel-frame]] / [[40-content/blog/publicados/normas-light-steel-frame-brasil|normas-light-steel-frame-brasil]] | já em produção → `public/images/img_blog/Normas LSF/normas_lsf.png` |
| `protecao-contra-queda.png` | [[protecao-contra-quedas-construcao-civil]] | |
| `vantagesn-desnavantens-lsf.png` | [[40-content/blog/publicados/steel-frame-vantagens-desvantagens|steel-frame-vantagens-desvantagens]] | typo histórico no nome |
| `reestruturando-o-concreto.jpg` | [[sustentabilidade-construcao-civil-economia-circular\|economia circular]] | re-purpose; já em produção → `public/images/img_blog/economia circular/economia_circular.jpg` |
| `energia-solar.png` | — | órfã — tema fotovoltaico (artigo "Solar + LSF" futuro) |
| `marmore.png` | — | órfã — material premium (artigo "Mármore em LSF" futuro) |
| `piscina-arraia.png` | — | órfã — projeto residencial específico |

## Órfãs e duplicatas

- **Órfãs (4)**: `energia-solar.png`, `marmore.png`, `piscina-arraia.png`, `reestruturando-o-concreto.jpg` (esta já reaproveitada em produção). Decidir com Bruno: descartar, criar artigo ou re-purpor.
- **Duplicatas intencionais do lote (20 grupos)**: `selected.webp` é a cópia estável do cenário escolhido; preservar.
- **Par PNG+WEBP legado (1 grupo)**: manter o `.webp` canonical e arquivar/descartar o `.png` quando não houver referência.
  - `lsf-mundial.png` → manter `lsf-mundial.webp`
  - `fogo-afeta-estrutura.png` → manter `fogo.webp`
  - `georgetown.png` → manter `georgetown-2.webp`

## Quando usar

- Backfill bidirecional: `material_visual_slug:` no frontmatter do artigo aponta para o arquivo da capa.
- Reutilizar capa em [[apresentacoes]] ou peça LinkedIn.
- Referência visual histórica ao regerar capa no Canva.

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/capas-blog/"
```

## Manutenção

- Nova capa = `[slug-do-artigo].webp` (kebab-case, sem espaços/typos), export WebP nativo do Canva.
- Ao publicar, anotar `producao_paths` na coluna Notas.
- Atualizar `arquivos_total` e rodar `--check`.
