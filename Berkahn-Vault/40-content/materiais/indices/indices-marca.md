---
tipo: indice
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
  - domain/brand
ai_summary: "Índice da categoria marca — 10 variações do logo Berkahn (branco, branco/preto, fundo branco, preto liso, escrito preto) em Docs/banco-imagens/marca/. Brand assets; nomenclatura ainda inconsistente. Canonical em [[guia-design-berkahn]]."
status: active
projeto: materiais
path_externo: "../../../../Docs/banco-imagens/marca/"
arquivos_total: 10
arquivos_mapeados: 10
arquivos_orfaos: 0
arquivos_duplicados: 0
---

# Índice — Marca

> **Localização externa**: `../../../../Docs/banco-imagens/marca/` (10 logos PNG, deduplicados de `brand/logos/` + `Identidade Visual/`).
> **Brand canonical**: [[guia-design-berkahn]] (`50-brand/`). Nenhum logo está atualmente cruzado com `public/images/` (0 em produção via este banco).

## Catálogo

| Arquivo | Uso em | Notas |
|---------|--------|-------|
| `logo-berkahn.png` | [[guia-design-berkahn]] | Logo base 1920×1080 — provável master |
| `logo-berkahn-branco.png` | decks, [[apresentacoes]] | Versão branca — sobre fundo escuro |
| `logo-berkahn-branco-preto.png` | decks | Branco com elementos pretos — sobre fundo cinza claro |
| `escrito-preto-logo-png.png` | docs, [[site]] | Texto preto isolado — sobre fundo branco |
| `preo-liso-png.png` | materiais minimalistas | Preto liso (typo histórico em `preo`) |
| `fundo-branco-logo-png.png` | web default | Sobre fundo branco — padrão consolidado |
| `fundo-branco-logo-1.png` | — | Variação fundo branco (400×200) |
| `fundo-branco-logo-2.png` | — | Variação fundo branco (validar diferença) |
| `fundo-branco-logo-12.png` | — | Variação fundo branco (validar diferença) |
| `fundo-branco-logo-21.png` | — | Variação fundo branco (validar diferença) |

## Quando usar

- Header/footer e meta OG do [[site]]
- Capas e slides de [[apresentacoes]] (deck /apresentacao-executiva)
- Peças Canva (capas, infográficos, materiais)
- Documentos formais / propostas comerciais

## Como ler binários

```bash
ls "../../../../Docs/banco-imagens/marca/"
```

Read direto suporta imagens (path absoluto).

## Manutenção

- Consolidar as 4 variações `fundo-branco-logo-N.png` — escolher canonical, arquivar resto.
- Definir com Bruno qual variação é a oficial de cada contexto e registrar em [[guia-design-berkahn]].
- Atualizar `arquivos_total` ao adicionar/remover variação; rodar `node scripts/vault-images.mjs --check`.
