---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "Índice da categoria parceiros — 4 banners de parceiros (Aquapanel, Eternit, Knauf, Sicla) em Docs/banco-imagens/parceiros/. 3 já em produção no site (SlidePartners / seção parcerias residencial)."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - apresentacoes
path_externo: "../../../../Docs/banco-imagens/parceiros/"
arquivos_total: 4
arquivos_mapeados: 4
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Parceiros

> **Localização externa**: `../../../../Docs/banco-imagens/parceiros/` (4 banners de parceiros).
> Usados no slide SlidePartners do deck e na seção "Parcerias que sustentam a qualidade" do site residencial.

## Catálogo

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `aquapanel-banner.png` | SlidePartners ([[apresentacoes]]) | Único NÃO em produção — sem match em `public/images/` |
| `eternit-banner.png` | [[site]], SlidePartners | já em produção → `public/images/Residencial/03 - PARCERIAS QUE SUSTENTAM A QUALIDADE/eternit_banner.png` |
| `knauf-banner.webp` | [[site]], SlidePartners | já em produção → `public/images/Residencial/03 - PARCERIAS QUE SUSTENTAM A QUALIDADE/knauf_banner.webp` |
| `sicla-banner.avif` | [[site]], SlidePartners | já em produção → `public/images/Residencial/03 - PARCERIAS QUE SUSTENTAM A QUALIDADE/sicla_banner.avif` |

## Quando usar

- Slide 14 SlidePartners da /apresentacao-executiva ([[apresentacoes]])
- Seção de parcerias no [[site]] residencial + footer
- Materiais comerciais que citam fornecedores homologados

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/parceiros/"
```

## Manutenção

- Para uso web, preferir os já otimizados (`.webp` / `.avif`); `aquapanel-banner.png` é candidato a conversão.
- Adicionar novos parceiros aqui + registrar `producao_paths` quando forem para o site.
- Atualizar `arquivos_total` e rodar `--check` ao adicionar banner.
