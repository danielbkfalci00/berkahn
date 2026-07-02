---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "Índice da categoria orcamento-prototipos — 22 imagens técnicas de protótipos de chalé (plantas, elevações, renders, estrutura LSF) em Docs/banco-imagens/orcamento-prototipos/. Subpastas chale-retangulo (17) e chale-triangulo (4) + estrutura-lsf.webp. 4 já em produção (orçamento-PDF/site)."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - orcamento-automacao
  - apresentacoes
path_externo: "../../../../Docs/banco-imagens/orcamento-prototipos/"
arquivos_total: 22
arquivos_mapeados: 22
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Orçamento / Protótipos

> **Localização externa**: `../../../../Docs/banco-imagens/orcamento-prototipos/` (22 arquivos em 2 subpastas + 1 solto).
> Sales-critical: alimentam o renderer do PDF de orçamento ([[orcamento-automacao]]) e propostas comerciais. 4 arquivos já em produção.

## Catálogo — `chale-retangulo/` (17)

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `chale-prototipo-1.jpeg` … `chale-prototipo-4.jpeg` | [[orcamento-automacao]], propostas | Renders do chalé retangular (4 imagens) |
| `planta-baixa-1.png`, `planta-baixa-2.png` | orçamento, propostas | Plantas baixas |
| `elevacao-norte.png`, `elevacao-sul.png`, `elevacao-leste.png`, `elevacao-oeste.png` | orçamento, propostas | 4 elevações |
| `estrutura-projeto-base-1.png` … `-3.png` | orçamento | Estrutura projeto base (3 imagens) |
| `herp-chale-retangulo-rocamento.png` | orçamento | Perspectiva/herp do orçamento |
| `lsf-1.webp` | [[orcamento-automacao]], [[construir-ou-comprar-pronto-numeros-grande-sp\|construir ou comprar]] | já em produção → `public/images/blog/construir-ou-comprar/cover.webp`, `public/images/img_blog/construir-ou-comprar/cover.webp`, `public/images/Lsf/lsf-1.webp` |
| `sobre-berkahn-1.webp` | orçamento-PDF (Sobre), /serviços | já em produção → `public/images/orcamento/sobre_berkahn_1.webp`, `public/images/Services/hero-servicos.webp` |
| `sobre-berkahn-2.webp` | orçamento-PDF (Sobre), /empresa | já em produção → `public/images/empresa/primeira-imagem.webp`, `public/images/orcamento/sobre_berkahn_2.webp` |

## Catálogo — `chale-triangulo/` (4)

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `chale-1.jpeg`, `chale-02.jpeg` | [[orcamento-automacao]], propostas | Renders do chalé triangular (A-frame) |
| `estrutura-projeto-base-01.png`, `estrutura-projeto-base-02.png` | orçamento | Estrutura projeto base |

## Catálogo — raiz (1)

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `estrutura-lsf.webp` | orçamento-PDF, /orçamento, /lsf | já em produção → `public/images/Lsf/lsf-wall-layers-diagram.webp`, `public/images/orcamento/estrutura-lsf.webp` |

## Quando usar

- Renderer do PDF de orçamento ([[orcamento-automacao]] — blocos Sobre, Padrões, projeto)
- Anexos de propostas/orçamentos comerciais
- Slides de projeto no deck ([[apresentacoes]])

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/orcamento-prototipos/"
ls "../../../../Docs/banco-imagens/orcamento-prototipos/chale-retangulo/"
ls "../../../../Docs/banco-imagens/orcamento-prototipos/chale-triangulo/"
```

## Manutenção

- `arquivos_total` (22) conta recursivamente as duas subpastas + o arquivo solto (o `--check` varre subpastas).
- Ao alterar assets do orçamento, sincronizar com `public/images/orcamento/` e anotar `producao_paths`.
- Rodar `node scripts/vault-images.mjs --check` após mudanças.
