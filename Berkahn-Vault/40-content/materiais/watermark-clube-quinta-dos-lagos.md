---
tipo: documentacao
criado: 2026-07-01
atualizado: 2026-07-01
tags:
  - project/materiais
  - status/active
  - source/manual
  - domain/brand
ai_summary: "Marca d'agua BERKAHN aplicada em 19 renders/fotos do projeto Clube Quinta dos Lagos (out C:/Users/bruno/Downloads/Arquitetura/Arquitetura/com-marca-dagua). Wordmark grande e centralizado, opacidade 15% (max discreto), cor adaptativa por regiao. Script reutilizavel scripts/watermark-images.mjs."
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - apresentacoes
arquivos_total: 19
---

# Marca d'agua BERKAHN — Clube Quinta dos Lagos

Registro da aplicacao de marca d'agua no lote de imagens de arquitetura do projeto **Clube Quinta dos Lagos** (13 renders "CLUBE QUINTA DOS LAGOS" + 6 fotos WhatsApp), para compartilhamento externo sinalizando autoria Berkahn.

## Entrega

- **Origem** (intacta): `C:\Users\bruno\Downloads\Arquitetura\Arquitetura\` — 19 JPEGs.
- **Saida**: `C:\Users\bruno\Downloads\Arquitetura\Arquitetura\com-marca-dagua\` — 19 JPEGs marcados (mesmos nomes).
- **Zip para Drive**: `C:\Users\bruno\Downloads\clube-quinta-dos-lagos-com-marca-dagua.zip`.

## Acabamento final (decisao do Bruno)

| Parametro | Valor |
|-----------|-------|
| Marca | Wordmark **"BERKAHN"** (sem tagline "Construtora de Alto Padrao") |
| Posicao | Centralizada, grande (~58% da largura) |
| Opacidade | **15%** (maximo discreto) |
| Cor | Adaptativa (branco/preto) pela luminancia da **regiao central** onde a marca cai |
| Contorno/halo | Desligado (versao mais sutil preferida) |
| Formato | JPEG quality 92, chroma 4:4:4; orientacao EXIF preservada |

**Fonte da marca**: `Docs/banco-imagens/marca/escrito-preto-logo-png.png` — o "BERKAHN" e isolado do logo-texto via projecao de alpha por linha (descarta o tagline). Ver [[indices-marca]] / [[banco-imagens]].

## Trade-off registrado

No nivel 15% (max discreto), em ~2-3 fotos muito claras e de centro ocupado (ex.: CLUBE 7) a marca fica quase imperceptivel — natureza do "menos aparente". Aceito pelo Bruno em favor da sutileza. Para deixar presente em todas, subir opacidade (ver comando).

## Como reproduzir / ajustar

Script: `scripts/watermark-images.mjs` (Node + sharp, reutilizavel para futuros lotes de obras).

```bash
# Refazer as 19 (mesmo acabamento):
node scripts/watermark-images.mjs --src="C:/Users/bruno/Downloads/Arquitetura/Arquitetura" --no-halo --opacity=0.15

# Mais presente em todas (ainda discreto):
node scripts/watermark-images.mjs --src="C:/Users/bruno/Downloads/Arquitetura/Arquitetura" --no-halo --opacity=0.25

# Preview de N imagens antes do lote:
node scripts/watermark-images.mjs --src="..." --pick="arquivo1.jpeg,arquivo2.jpeg" --out="..._preview"
```

Flags: `--src` `--out` `--logo` `--frac=0.58` `--opacity=0.15` `--color=auto|white|black` `--halo` `--halo-opacity` `--pick` `--limit` `--dry-run`. Originais nunca sao alterados (escreve so em `--out`).

## Follow-up possivel

- Catalogar estes assets em [[indices-obras-projetos]] (banco de imagens, `obras-projetos/`) se virarem material recorrente de apresentacao/portfolio.

---

Relacionado: [[banco-imagens]] (MOC) · [[indices-marca]] · [[guia-design-berkahn]] · [[materiais]] (hub)
