---
tipo: indice
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/site
  - project/material
  - project/apresentacao
  - status/active
  - source/manual
ai_summary: Índice consolidado de imagens gerais em Docs/Imagens/ — Comercial (1 mapa Brasil), LSF (2 diagramas), residencial/Parceiros (4 logos de parceiros aquapanel/eternit/knauf/sicla), projetos (vazio). Combina pastas pequenas em um único índice por eficiência.
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - apresentacoes
path_externo: "../../../../Docs/Imagens/"
arquivos_total: 7
---

# Índice — Imagens Gerais (Docs/Imagens/)

> **Localização externa**: `Docs/Imagens/` (subpastas: Comercial, LSF, residencial, projetos, etc).
> Índice consolidado por eficiência — pastas pequenas (1-4 arquivos cada) em uma única nota.

## Catálogo por subpasta

### Comercial/

| Arquivo | Tipo | Uso |
|---------|------|-----|
| `mapa_brazil.png` | PNG | Mapa Brasil para slides comerciais/SlideBrazilOpportunity |

### LSF/

| Arquivo | Tipo | Uso |
|---------|------|-----|
| `lsf-hero-structure.png` | PNG | Hero structure / hero seção LSF site (`/lsf` page?) |
| `lsf-wall-layers-diagram.png` | PNG | Diagrama camadas parede LSF — artigo educativo |

### residencial/Parceiros/

| Arquivo | Tipo | Parceiro | Uso |
|---------|------|----------|-----|
| `aquapanel_banner.png` | PNG | Aquapanel | SlidePartners (slide 14) |
| `eternit_banner.png` | PNG | Eternit | SlidePartners |
| `knauf_banner.webp` | WEBP | Knauf | SlidePartners |
| `sicla_banner.avif` | AVIF | Sicla | SlidePartners |

### projetos/

(vazio — placeholder para futuras fotos de projetos)

## Quando usar

- **Mapa Brasil** (Comercial): slide 7 SlideBrazilOpportunity em [[presentation-system]]
- **Diagramas LSF**: páginas `/lsf`, artigos técnicos do blog, [[steel-frame-domain]]
- **Logos parceiros**: slide 14 SlidePartners da /apresentacao-executiva, footer site, materiais comerciais

## Como ler binários

```bash
ls "../../../../Docs/Imagens/"
ls "../../../../Docs/Imagens/Comercial/"
ls "../../../../Docs/Imagens/LSF/"
ls "../../../../Docs/Imagens/residencial/Parceiros/"
```

## Manutenção

- Popular `projetos/` com fotos de obras (Casa Santa Cristina, Vila Serrana, Residência Monteiro)
- Padronizar formatos: webp para web (menor) preferível a png/avif
- Adicionar logos faltantes (Brand 01, Lumen mencionados em [[presentation-system]])
- Quando subpasta crescer >10 arquivos, criar índice dedicado
