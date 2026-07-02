---
tipo: documentacao
criado: 2026-06-02
atualizado: 2026-06-02
tags:
  - project/site
  - status/active
projeto: site
ai_summary: Workflow repetível para adicionar ou atualizar um arquiteto parceiro na curadoria (/curadoria-berkahn). Documenta os scripts (scrape/optimize/contact-sheet/screenshot — que ficam em /scripts/ gitignored), o fluxo passo a passo, o contrato de dados e as regras de posicionamento/voz. Use ao onboardar um novo parceiro ou quando um parceiro mandar material novo.
status: active
---

# Pipeline — Adicionar/atualizar arquiteto na curadoria

Como capturar conteúdo público de um arquiteto e transformá-lo num perfil real no Hub de Curadoria. Fonte única dos dados: `lib/architects-data.ts`. Imagens versionadas em `public/images/arquitetos/{slug}/`. Posicionamento: o arquiteto assina o projeto, a **Berkahn constrói em Light Steel Frame** (ver [[berkahn-brand]], [[copy-sem-travessao]]).

> **Atenção:** os scripts vivem em `/scripts/` que é **gitignored** (não versionado). Esta nota é a fonte de recuperação se os arquivos locais se perderem — os trechos-chave estão descritos abaixo.

## Scripts (locais, `/scripts/`)

| Script | O que faz | Uso |
|---|---|---|
| `architects-sources.json` | Config: por arquiteto, lista de URLs (páginas públicas) + `excludePatterns` de imagem | editar à mão |
| `scrape-architects.mjs` | Headless (reusa `puppeteer-core` + Chrome local) renderiza páginas JS, sniffa imagens (DOM + network), normaliza URLs (Wix/Google), baixa cru + dumpa texto | `node scripts/scrape-architects.mjs --slug=<slug>` |
| `optimize-architect-images.mjs` | sharp → webp; filtra por dimensão (`--min`), deduplica (hash), resize (`--max`), grava em `public/images/arquitetos/{slug}/` + manifesto | `node scripts/optimize-architect-images.mjs --slug=<slug> --min=700` |
| `contact-sheet.mjs` | Monta grade numerada das imagens otimizadas p/ curadoria visual | `node scripts/contact-sheet.mjs --slug=<slug> --cols=6` |
| `screenshot.mjs` | Screenshot de uma URL local (validação visual; `--width`/`--height` p/ mobile) | `node scripts/screenshot.mjs --url=http://localhost:3000/curadoria-berkahn/<slug> --out=... --full` |

Cache cru/intake: `scripts/.cache/architects-raw/{slug}/` e `scripts/.cache/architects-intake/{slug}/` (drops manuais). Tudo gitignored.

## Fluxo

1. **Fontes** → adicionar/editar o bloco do arquiteto em `scripts/architects-sources.json` (preferir o site oficial; evitar páginas pobres tipo Lovable/SPA quando houver site real). Instagram não é raspável (login wall) → material do IG entra manual no intake.
2. **Raspar** → `scrape-architects.mjs --slug=<slug>`. Confere o `text-*.txt` p/ bio/specs e o `images-*.json`.
3. **Otimizar** → `optimize-architect-images.mjs --slug=<slug>` (ajustar `--min` p/ filtrar thumbnails/diagramas).
4. **Curar** → `contact-sheet.mjs --slug=<slug>` e abrir o `_contact-sheet.png`. Identificar o **projeto-âncora** (mesmo projeto, ≥4 imagens), os de galeria (1 cada) e descartar plantas/diagramas/ruído.
5. **Modelar** → preencher a entrada no `lib/architects-data.ts` (contrato abaixo), na **voz de marca** (zero travessão; LSF na 1ª menção; sem clichê de IA; concepts/timeline só com fatos reais).
6. **Verificar** → `npm run dev` + `screenshot.mjs` (desktop + mobile `--width=390`). Conferir hero, bio (retrato!), métricas, âncora, galeria, contato.
7. **Publicar** → as 3 páginas seguem `noindex`/privadas (experiência por link). Build (`npm run build`), commit, deploy só com OK.

## Contrato de dados (`Architect`)

`slug · studioName · city · state · styleTags[3-4] · shortPitch · bio (\n\n) · yearFounded · metrics{yearsActive, completedProjects, areaBuilt} · customMetrics?[{label,value}] · history[3-5] · contact{website, instagram, phone, email?} · studioPhoto · architectPhoto · architectName · hubLayoutVariant · projects[]`

**Mínimos p/ não quebrar:** 1 `isAnchor` com **≥4 imagens**; **≥1 projeto não-âncora**; `completedProjects` > 0 (senão "0+"). Para arquiteto emergente sem métricas de escritório, usar **`customMetrics`** (ex: Bianchi — "Atua desde 2019" / "Foco LEED + BIM" / idiomas) em vez dos 3 números padrão.

**Crédito de terceiros:** se as obras forem de outro escritório (ex: Bianchi na Are), creditar no `concept`/`program` ("(Are Arquitetura)") e confirmar autorização de imagem.

## Histórico
- 2026-06-02: pipeline criado; substituídos 4 mocks por 3 reais ([[rosmari-calefe-revisao]], [[maria-isabel-bianchi-revisao]], [[airos-revisao]]). Ver [[intake-checklist]].
