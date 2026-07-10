---
tipo: meta
criado: 2026-07-09
atualizado: 2026-07-10
tags:
  - project/material
  - project/site
  - source/manual
  - status/active
ai_summary: Documento institucional PDF "O que fazemos" (9 páginas A4) para clientes que perguntam o que a Berkahn executa. v3 "Suíço-brutalista / Blueprint" — Archivo (grotesca gigante) + Space Mono (camada técnica), acento azul blueprint #123A5E, grid exposto, números enormes, title-block/carimbo, páginas blueprint. Foge dos "tells" de IA (sem Playfair/eyebrow/fio fino). Gerado pelo pipeline Puppeteer (/institucional/pdf). Artefato Docs/berkahn-institucional-v3.pdf (6.7MB). Copy em lib/institucional-data.ts; sistema em app/institucional/pdf/institucional.module.css.
status: active
projeto: materiais
projetos_relacionados:
  - materiais
  - site
contextos_aplicados:
  - berkahn-brand
  - design-principles
  - steel-frame-domain
workflow: workflow-material
---

# Documento Institucional — PDF "O que fazemos"

Material institucional para responder a pergunta recorrente de clientes: **"o que vocês executam da obra?"**. Enviável por WhatsApp/e-mail. Briefing original do Daniel (2026-07-09).

## Mensagens-chave (todas contempladas)

1. Dominamos todos os sistemas construtivos, **especialistas em construção a seco** (LSF)
2. Construção molhada quando a norma exige (fundação, muro de arrimo, piscina — NBR 6122/16970)
3. Projetistas e arquitetos parceiros
4. Gerenciamento de projetos
5. Compatibilização de projetos
6. Dois modelos de contratação: **obra completa** OU **só o time especialista em LSF**
7. Da concepção à **entrega das chaves**

## Design v3 — "Suíço-brutalista / Blueprint" (versão atual)

O v1 reaproveitou o site; o v2 virou "monografia editorial" (Playfair) — e o Bertevello rejeitou: **"fica muito Claude"**. Pesquisa (ver abaixo) mostrou que o v2 era feito de "tells" catalogados de IA. O v3 é a resposta: um documento de engenharia autoral.

- **Direção**: Suíço-brutalista + acento azul blueprint (decisão Bruno). Pôster tipográfico de estúdio, não editorial elegante.
- **Tipografia**: **Archivo** (grotesca industrial, 400–900) para títulos GIGANTES flush-left e números; **Space Mono** para a camada técnica (labels, specs, numeração de folha, title-block, captions). Carregadas via next/font em `page.tsx`, escopadas.
- **Paleta**: branco frio `#F3F3F0` + `#131313` + **azul blueprint `#123A5E`** (fundo de 3 páginas + acento). NÃO cream (cream é tell de IA).
- **Sistema**: grid exposto, barras grossas (não fio fino), números enormes como grafismo, mono nas labels (mata o tell "eyebrow" e "01/09"), **title-block/carimbo** estilo prancha, camadas LSF como spec-list, tabelas de dados tabulares, fotos corte duro. Tudo em `app/institucional/pdf/institucional.module.css`.
- **Anti-tell**: SEM Playfair · SEM eyebrow uppercase-tracked · SEM fio fininho · SEM off-white quente · SEM simetria. Fonte do diagnóstico: impeccable.style/slop.
- **Imagens** via `optImg()` (otimizador Next) — page.pdf() embutia bitmaps crus (31 MB → 6.7 MB). Larguras devem estar em deviceSizes/imageSizes do Next (1200/1080/828/640/384/256).

## Pesquisa de referência (v3)

Direções e antídotos vieram de 3 pesquisas web. Refs-chave: **impeccable.style/slop** (catálogo de tells de IA), NASA Graphics Standards Manual, Teenage Engineering (mono-only, honestidade de engenharia), David Chipperfield/John Morgan, OMA/AMO (diagrama como linguagem), USM Haller, **Porto Rocha/MASP** (estúdio BR). Insight: o LSF é um kit de perfis montado como sistema → a linguagem nativa é ficha técnica / manual de engenharia.

## Artefato e como regenerar

| Item | Onde |
|------|------|
| **PDF distribuível** | `Docs/berkahn-institucional-v3.pdf` (9 páginas A4 retrato, 6.7MB) |
| Página fonte (noindex) | `berkahn.com.br/institucional/pdf` |
| Rota de geração | `GET /api/institucional/pdf` (esconde badge Next dev; `?dpr` NÃO muda tamanho — page.pdf é vetorial) |
| **Copy (fonte da verdade)** | `lib/institucional-data.ts` |
| **Sistema visual** | `app/institucional/pdf/institucional.module.css` |
| Fontes | Archivo + Space_Mono (next/font em `app/institucional/pdf/page.tsx`) |
| Componentes | `components/institucional/pdf/*.tsx` (9 páginas) |

**Regenerar** (requer `CHROME_LOCAL_PATH` no `.env.local`, já configurado):

```powershell
npm run dev
Invoke-WebRequest "http://localhost:3000/api/institucional/pdf" -OutFile "Docs/berkahn-institucional-v3.pdf"
```

## Estrutura (9 páginas, ritmo dark/light)

1. **Capa** (dark) — "Do conceito à entrega das chaves"
2. **Quem somos** (light) — construtora ≠ empreiteira, 3 pilares, stats
3. **O que fazemos** (off-white) — projetos/arquitetos · gerenciamento · compatibilização · execução
4. **Sistemas construtivos** (dark) — todos os sistemas / especialistas a seco / molhada quando a norma exige + NBRs
5. **Modelos de contratação** (light) — obra completa OU time LSF
6. **Como trabalhamos** (off-white) — 4 fases com prazos (EXECUTION_PHASES)
7. **Portfólio** (dark) — Casa Santa Cristina · Vila Serrana · Residência Monteiro
8. **Fundadores + parceiros** (light) — 3 sócios + faixa escura com logos
9. **Contato** (dark) — contato.berkahn@gmail.com (decisão: gmail, não o @berkahn.com.br do orçamento)

Design conforme [[design-principles]] (mono estrito preto/branco/off-white #F4F2EC) mas em registro editorial próprio (Playfair Display), e voz conforme [[berkahn-brand]] (terminologia Light Steel Frame/LSF, sem vícios de IA). Domínio técnico: [[steel-frame-domain]], [[lsf-normas-nbr]], [[lsf-fundacao]].

## Histórico

- 2026-07-09 — v1 criada (branch `feat/institucional-pdf`, mergeada via PR #14). Reaproveitou o visual do site (Manrope, cards). **Superseded pelo v2.**
- 2026-07-10 — **v2 "Monografia editorial"** (Playfair, mono estrito). **Rejeitado**: "fica muito Claude / cara de IA".
- 2026-07-10 — **v3 "Suíço-brutalista / Blueprint"** (versão atual, branch `design/institucional-monografia` → PR #17). Redesign a partir de pesquisa web de anti-IA + direções de estúdio. Archivo + Space Mono, azul blueprint, grid exposto, title-block, números gigantes. Conteúdo e infra preservados. Verificado página a página. Workflow: pipeline de PDF do site (não Canva).
