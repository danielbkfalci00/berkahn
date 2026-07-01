---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "Índice da categoria referencia — 34 screenshots/inspiração/stock em Docs/banco-imagens/referencia/ (+ 2 PDFs não contados). Subpastas: remodelacao (mockups de redesign), seo-aeo (prints Search Console), site-ref (referências de UI), stock (imagens de banco) + 5 soltas. NÃO curado para galeria pública."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - seo-aeo
path_externo: "../../../../Docs/banco-imagens/referencia/"
arquivos_total: 34
---

# Índice — Referência

> **Localização externa**: `../../../../Docs/banco-imagens/referencia/` (34 imagens + 2 PDFs).
> Material de **apoio/inspiração**: screenshots, mockups, prints e stock. **Não curado** para galeria pública — é insumo de trabalho, não asset de marca.
> Nota: `arquivos_total: 34` conta só mídia (o `--check` ignora os 2 PDFs).

## Subpasta — `remodelacao/` (9 PNG + 1 PDF)

- **Arquivos**: `1.png` … `9.png` + `remodelacao-site.pdf`.
- **Uso**: mockups de redesign do [[site]] — planejamento de refactor. PDF = documento completo de redesign (legível via Read, suporta PDFs).
- **Relacionado**: [[paginas-conteudo-v2]] (conteúdo das páginas, migrado).

## Subpasta — `seo-aeo/` (6 PNG + 1 PDF)

- **Arquivos**: `consultas-berkahn.png`, `core-web-vitals.png`, `indexacao-1.png` … `indexacao-4.png` + `seo-guide.pdf`.
- **Uso**: prints de Search Console / Core Web Vitals como evidência em auditorias [[seo-aeo]]. PDF = guia SEO.

## Subpasta — `site-ref/` (5 PNG)

- **Arquivos**: `captura-de-tela-2025-12-09-184617.png` … `-185059.png` (5 capturas).
- **Uso**: referências de UI/layout de outros sites para inspiração de design do [[site]].

## Subpasta — `stock/` (9)

- **Arquivos**: 8 JPG (hashes + `construction-02.jpg`, `light-gauge-steel-house-framing-2.jpg`) + 1 WEBP (`the-future-of-building-...-construction.webp`).
- **Uso típico**: imagens de banco (light gauge steel / construção) como placeholder ou inspiração; não são fotos próprias — checar licença antes de publicar.
- **Exemplos**: `construction-02.jpg`, `light-gauge-steel-house-framing-2.jpg`.

## Soltas na raiz (5 PNG)

- `29.png`, `31.png`, `32.png`, `33.png` (renders grandes 3840×2160, IDs genéricos — validar), `design-sem-nome-32.png` (peça Canva sem nome, 1200×630 — provável OG).

## Quando usar

- Planejamento de refactor do [[site]] (mockups + referências de UI)
- Evidência visual em auditorias [[seo-aeo]]
- Placeholder/inspiração (stock) — nunca como asset final de marca sem checar licença

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/referencia/"
ls "../../../../Docs/banco-imagens/referencia/remodelacao/"
ls "../../../../Docs/banco-imagens/referencia/seo-aeo/"
ls "../../../../Docs/banco-imagens/referencia/site-ref/"
ls "../../../../Docs/banco-imagens/referencia/stock/"
```

## Manutenção

- Categoria de descarte natural: ao concluir um refactor/auditoria, arquivar o material correspondente em `99-archive/`.
- Não gerar galeria pública desta categoria (é insumo interno).
- `arquivos_total` conta só mídia; se adicionar PDF, ele não altera a contagem do `--check`.
