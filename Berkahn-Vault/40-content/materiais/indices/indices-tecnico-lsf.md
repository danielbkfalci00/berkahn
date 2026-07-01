---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
  - domain/lsf
ai_summary: "Índice da categoria tecnico-lsf — 5 diagramas/imagens técnicas LSF (hero, camadas de parede, mapa Brasil, renders steel-frame) em Docs/banco-imagens/tecnico-lsf/. 3 já em produção. Usados em páginas /lsf e artigos técnicos."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - blog
path_externo: "../../../../Docs/banco-imagens/tecnico-lsf/"
arquivos_total: 5
arquivos_mapeados: 5
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Técnico LSF

> **Localização externa**: `../../../../Docs/banco-imagens/tecnico-lsf/` (5 imagens técnicas LSF).
> Diagramas e renders de apoio para páginas técnicas e artigos educativos. Contexto de domínio: [[steel-frame-domain]].

## Catálogo

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `lsf-hero-structure.png` | [[site]] (/lsf hero) | Render de estrutura LSF em obra (3840×2160) |
| `lsf-wall-layers-diagram.png` | artigos técnicos, [[isolamento-termico-acustico-steel-frame]] | Diagrama de camadas da parede LSF |
| `mapa-brazil.png` | SlideBrazilOpportunity ([[apresentacoes]]) | já em produção → `public/images/mapa-brazil.png` |
| `comercial-steel-frame.webp` | [[site]] | já em produção → `public/images/Others/comercial_steel_frame.webp` |
| `mac-steel-frame.webp` | [[site]] | já em produção → `public/images/Others/mac_steel_frame.webp` |

## Quando usar

- Página /lsf e seções técnicas do [[site]]
- Artigos técnicos do [[blog]] (camadas, isolamento, estrutura)
- Slide de oportunidade Brasil no deck comercial ([[apresentacoes]])

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/tecnico-lsf/"
```

## Manutenção

- `lsf-wall-layers-diagram.png` é candidato a webp (há variante em produção `public/images/Lsf/lsf-wall-layers-diagram.webp` gerada de outro asset — ver [[indices-orcamento-prototipos]]).
- Atualizar `arquivos_total` e rodar `--check` ao adicionar diagrama.
