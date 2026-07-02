---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-02
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "Índice da categoria obras-projetos — 57 imagens de obras/projetos em Docs/banco-imagens/obras-projetos/. 41 obra-carrossel-NN (fotos de obra p/ apresentação/social) + 16 curadas: renders de serviços, chalé, casa-campo, home e loft. As 6 novas (36-41: residência acabada + detalhes LSF) foram otimizadas p/ projeto-43..48.webp no globo (DomeGallery) da apresentação executiva."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - apresentacoes
path_externo: "../../../../Docs/banco-imagens/obras-projetos/"
arquivos_total: 57
arquivos_mapeados: 16
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Obras / Projetos

> **Localização externa**: `../../../../Docs/banco-imagens/obras-projetos/` (57 arquivos).
> Divide-se em: 41 imagens do **carrossel de apresentação** (bloco de volume) + 16 renders/fotos **curadas** de serviços, chalé, casa-campo, home e loft.

## Catálogo curado (16)

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `home-hero.png` | [[site]] (home hero) | 3840×2160 |
| `home-gallery-1.png`, `home-gallery-2.png` | [[site]] (home galeria) | 2048×1152 |
| `servicos-hero.png` | [[site]] (/serviços hero) | 3840×2160 |
| `servicos-foundations.png` | [[site]] (/serviços — fundações) | |
| `servicos-structure.png` | [[site]] (/serviços — estrutura) | |
| `servicos-finished.png` | [[site]] (/serviços — acabamento) | |
| `chale-rustico.png` | [[site]], [[apresentacoes]] | Render chalé rústico (3840×2160) |
| `chale-chale-interior-1.webp` … `-4.webp` | [[site]], propostas | Interiores de chalé (4 webp) |
| `chale-nordica-frame-01-1.webp` | [[site]], propostas | Chalé nórdico A-frame |
| `loft-urbano.png` | [[site]], [[apresentacoes]] | Render loft urbano |
| `casa-campo-pagina-inicial-parte-1-26.png`, `casa-campo-pagina-inicial-parte-1-27.png` | [[apresentacoes]] | Casa de campo (páginas de deck) |

## Bloco de volume — carrossel de projetos (41)

- **Arquivos**: `obra-carrossel-01.jpeg` … `obra-carrossel-41.jpeg` (numeração sequencial contínua).
- **Origem**: fotos de obra vindas do WhatsApp (6-jan-2026), consolidadas e renomeadas. As 6 mais recentes (`obra-carrossel-36`…`41`, adicionadas 2026-07-02) são de uma **residência acabada** (suíte + banheiros) e **detalhes de execução LSF** (montante galvanizado + beiral).
- **Formato**: JPEG, mix de retrato (720×1600 / 1200×1600) e paisagem (1600×720 / 1280×576).
- **Uso típico**: carrossel de projetos/obras em [[apresentacoes]] e social ([[linkedin]]); prova visual de execução em propostas.
- **Exemplos**: `obra-carrossel-01.jpeg` (paisagem 1600×720), `obra-carrossel-09.jpeg` (retrato 720×1600), `obra-carrossel-22.jpeg` (retrato 1200×1600).
- **No globo (DomeGallery)**: `obra-carrossel-36`…`41` foram otimizadas p/ `public/images/galeria/projeto-43.webp`…`projeto-48.webp` e entraram na esfera 3D da apresentação executiva ([[presentation-system]]) — interiores acabados em destaque na frente, detalhes LSF ao fundo; substituíram 9 tiles redundantes de chalé (mantidos `projeto-01/04/08`).

Não enumerado 1-a-1 por ser bloco homogêneo. Para triar, abrir a galeria (thumbnails) ou `ls` abaixo.

## Quando usar

- Home e /serviços do [[site]] (heros e galerias — usar os curados)
- Carrossel de projetos em decks ([[apresentacoes]]) e posts ([[linkedin]])
- Renders de tipologia (chalé, loft, casa-campo) em propostas comerciais

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/obras-projetos/"
# só o carrossel:
ls "../../../../Docs/banco-imagens/obras-projetos/" | grep obra-carrossel
```

## Manutenção

- Ao selecionar imagem do carrossel para uso real, mover a menção para a tabela curada com o `uso_em`.
- `arquivos_total` (57) = 16 curadas + 41 carrossel.
- Rodar `node scripts/vault-images.mjs --check` após mudanças.

## Relacionado

- [[watermark-clube-quinta-dos-lagos]] — 26 imagens do Clube Quinta dos Lagos com marca d'água BERKAHN (candidatas a catalogar aqui se virarem material recorrente).
