---
tipo: indice
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/site
  - project/material
  - status/active
  - source/manual
ai_summary: Índice de mockups de remodelação do site em Docs/REMODELAÇÃO/ — 9 mockups (1.png a 9.png) + PDF de redesign. Estratégia de páginas + competitor research (já migrados para 40-content/pesquisa-mercado/). Material de planejamento de refactor do site.
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - pesquisas
path_externo: "../../../../Docs/REMODELAÇÃO/"
arquivos_total: 10
---

# Índice — Mockups Remodelação Site (Docs/REMODELAÇÃO/)

> **Localização externa**: `Docs/REMODELAÇÃO/` (9 mockups PNG + 1 PDF + 1 subpasta competitor-research).
> **Markdowns relacionados** (migrados):
> - [[paginas-conteudo-v2]] — conteúdo páginas (em `40-content/pesquisa-mercado/`)
> - [[stalart-snapshot]] — competitor (em `40-content/pesquisa-mercado/competitor-research/`)

## Catálogo

| Arquivo | Tipo | Propósito provável |
|---------|------|--------------------|
| `1.png` | PNG | Mockup página 1 (Home?) |
| `2.png` | PNG | Mockup página 2 |
| `3.png` | PNG | Mockup página 3 |
| `4.png` | PNG | Mockup página 4 |
| `5.png` | PNG | Mockup página 5 |
| `6.png` | PNG | Mockup página 6 |
| `7.png` | PNG | Mockup página 7 |
| `8.png` | PNG | Mockup página 8 |
| `9.png` | PNG | Mockup página 9 |
| `remodelação_site.pdf` | PDF | Documento completo de redesign |
| `competitor-research/` | Pasta | Competitor snapshots (Stalart) — markdown migrado |

## Quando usar

- Planejamento de refactor do site (junto com [[site]] hub)
- Referência visual para PRs em `app/`
- Documento histórico de visão de redesign

## Como ler binários

```bash
# Listar:
ls "../../../../Docs/REMODELAÇÃO/"
```

PDF pode ser lido via ferramenta Read (suporta PDFs até 20 páginas por chamada).

## Manutenção

- Padronizar naming mockups (`mockup-01-home.png` em vez de `1.png`) para clareza
- Vincular cada mockup à rota correspondente no `app/`
- Quando refactor for implementado, arquivar para `99-archive/`
