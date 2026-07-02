---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-02
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "MOC do banco de imagens Berkahn — 166 arquivos em Docs/banco-imagens/ organizados em 9 categorias. Entry-point para os 9 índices de catálogo + galerias visuais (thumbnails). Fonte binária fora do vault; catálogo aqui."
status: active
projeto: materiais
path_externo: "../../../Docs/banco-imagens/"
arquivos_total: 166
---

# Banco de Imagens — MOC

> **Fonte binária**: `../../../Docs/banco-imagens/` (fora do vault por tamanho — 166 arquivos, ~219 MB).
> Esta nota é o **entry-point** do catálogo. Os binários vivem em `Docs/`; o catálogo textual (para SKIM/GREP do Claude) vive aqui; as galerias visuais (thumbnails `.webp`) já estão disponíveis por categoria (`[[galeria-marca]]`, `[[galeria-obras-projetos]]`, …) e no dashboard [[banco-imagens.base]].

## Estrutura em 3 camadas

1. **Fonte** — `Docs/banco-imagens/<categoria>/` — os arquivos reais (PNG/WEBP/JPEG/AVIF). Nunca inflam o git do vault.
2. **Catálogo** — as 9 notas-índice abaixo (`indices-<categoria>.md`) — tabelas com `uso_em`, flags `em produção`, contagens. Alimentam [[materiais.base]].
3. **Galerias** — 8 notas-galeria (`galeria-<categoria>.md` em `40-content/materiais/banco-imagens/`) com grades de thumbnails `.webp` (400px, ~2.9 MB total) para navegação visual e "puxar" assets: `[[galeria-marca]]`, `[[galeria-obras-projetos]]`, etc. Regeráveis via `node scripts/vault-images.mjs --thumbs`. (`referencia` não tem galeria — assets não curados.)

## As 9 categorias

| Categoria | # | Quando usar | Índice | Galeria |
|-----------|---|-------------|--------|---------|
| **marca** | 10 | Logo Berkahn em qualquer suporte (site, deck, material, doc) | [[indices-marca]] | [[galeria-marca]] |
| **parceiros** | 4 | Banners de parceiros (Aquapanel, Eternit, Knauf, Sicla) em SlidePartners / footer | [[indices-parceiros]] | [[galeria-parceiros]] |
| **obras-projetos** | 57 | Fotos de obras, renders de serviços, carrossel de projetos p/ site, decks e social | [[indices-obras-projetos]] | [[galeria-obras-projetos]] |
| **equipe** | 11 | Fotos institucionais (Daniel, Matheus, Gabriel) p/ /empresa, SlideFounders, LinkedIn | [[indices-equipe]] | [[galeria-equipe]] |
| **tecnico-lsf** | 5 | Diagramas técnicos LSF, mapa Brasil — páginas /lsf, artigos técnicos | [[indices-tecnico-lsf]] | [[galeria-tecnico-lsf]] |
| **orcamento-prototipos** | 22 | Protótipos de chalé (plantas, elevações, renders) p/ orçamento/proposta comercial | [[indices-orcamento-prototipos]] | [[galeria-orcamento-prototipos]] |
| **capas-blog** | 22 | Capas Canva de artigos do blog (versão em produção fica em `public/images/`) | [[indices-capas-blog]] | [[galeria-capas-blog]] |
| **materiais-marketing** | 1 | Peças LinkedIn finalizadas (arquivo) | [[indices-materiais-marketing]] | [[galeria-materiais-marketing]] |
| **referencia** | 34 | Screenshots, mockups, stock e inspiração — **não curados** p/ galeria pública | [[indices-referencia]] | — |

**Total**: 166 arquivos · 9 categorias · **16 já em produção** (cruzados por sha256 com `public/images/`).

## Como o catálogo é gerado/validado

```bash
# Regerar inventário completo (path, dims, bytes, em_producao, producao_paths)
node scripts/vault-images.mjs --inventory   # -> banco-inventory.json

# Detectar duplicatas exatas (sha256) e pares PNG/WEBP
node scripts/vault-images.mjs --dupes

# Conferir arquivos_total declarado nos índices vs realidade
node scripts/vault-images.mjs --check
```

O `--check` compara o campo `arquivos_total` de cada `indices-*.md` com a contagem real de mídia na subpasta (PDFs não contam). Rodar após adicionar/remover binários.

## Manutenção

- Ao adicionar binário: soltar em `Docs/banco-imagens/<categoria>/`, atualizar a tabela + `arquivos_total` no índice da categoria, rodar `--check`.
- Ao publicar asset no site: ele vira `em_producao: true` no próximo `--inventory`; anotar o `producao_paths` na coluna Notas do índice.
- Galerias (thumbnails) são derivadas — regeráveis a qualquer momento a partir da fonte.

---

**Hubs relacionados**: [[materiais]] (hub do projeto) · [[materiais.base]] (dashboard dinâmico dos índices)
