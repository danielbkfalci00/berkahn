---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
ai_summary: "Índice da categoria obras-projetos — 51 imagens de obras/projetos em Docs/banco-imagens/obras-projetos/. 35 obra-carrossel-NN (apresentação de projetos, bloco de volume) + 16 curadas: renders de serviços, chalé, casa-campo, home e loft. Nenhuma em produção via este banco."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
  - apresentacoes
path_externo: "../../../../Docs/banco-imagens/obras-projetos/"
arquivos_total: 51
arquivos_mapeados: 16
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Obras / Projetos

> **Localização externa**: `../../../../Docs/banco-imagens/obras-projetos/` (51 arquivos).
> Divide-se em: 35 imagens do **carrossel de apresentação** (bloco de volume) + 16 renders/fotos **curadas** de serviços, chalé, casa-campo, home e loft.

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

## Bloco de volume — carrossel de projetos (35)

- **Arquivos**: `obra-carrossel-01.jpeg` … `obra-carrossel-35.jpeg` (numeração sequencial contínua).
- **Origem**: fotos de obra vindas do WhatsApp (6-jan-2026), consolidadas e renomeadas.
- **Formato**: JPEG, mix de retrato (720×1600 / 1200×1600) e paisagem (1600×720 / 1280×576).
- **Uso típico**: carrossel de projetos/obras em [[apresentacoes]] e social ([[linkedin]]); prova visual de execução em propostas.
- **Exemplos**: `obra-carrossel-01.jpeg` (paisagem 1600×720), `obra-carrossel-09.jpeg` (retrato 720×1600), `obra-carrossel-22.jpeg` (retrato 1200×1600).

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
- `arquivos_total` (51) = 16 curadas + 35 carrossel.
- Rodar `node scripts/vault-images.mjs --check` após mudanças.

## Relacionado

- [[watermark-clube-quinta-dos-lagos]] — 26 imagens do Clube Quinta dos Lagos com marca d'água BERKAHN (candidatas a catalogar aqui se virarem material recorrente).
