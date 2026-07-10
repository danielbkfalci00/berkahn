---
tipo: meta
criado: 2026-07-09
atualizado: 2026-07-10
tags:
  - project/material
  - project/site
  - source/manual
  - status/active
ai_summary: Documento institucional PDF "O que fazemos" (9 páginas A4) para clientes que perguntam o que a Berkahn executa. v2 "Monografia editorial" — tipografia Playfair Display + Manrope, mono estrito (SEM champagne), fotografia full-bleed, grid assimétrico, numerais gigantes. Gerado pelo pipeline Puppeteer do site (/institucional/pdf). Artefato em Docs/berkahn-institucional-v2.pdf (7.6MB). Copy em lib/institucional-data.ts; sistema visual em app/institucional/pdf/institucional.module.css.
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

## Design v2 — "Monografia editorial"

O v1 reaproveitou o visual do site (cards/pills/ícones, só Manrope) e o Bruno rejeitou: sem identidade de peça. O v2 é redesenhado como monografia:

- **Tipografia**: Playfair Display (display, já carregada global no `<html>` via `app/layout.tsx`) + Manrope (corpo). Editorial de verdade.
- **Paleta**: MONO ESTRITO (decisão do Bruno) — off-white #F4F2EC, charcoal #1A1A1A, branco. **SEM champagne** (o dourado #d9b061 existe só no orçamento estimativa, não é da marca). A originalidade vem de tipografia + layout + fotografia, não de cor.
- **Sistema**: numerais de seção gigantes em Playfair, fios finos, bullets-tracinho, grid assimétrico, fotografia full-bleed cinematográfica, ritmo claro/escuro. Tudo em `app/institucional/pdf/institucional.module.css` (CSS Module).
- **Imagens** passam pelo otimizador do Next via helper `optImg()` em `lib/institucional-data.ts` — sem isso o `page.pdf()` embutia bitmaps crus (31 MB → 7.6 MB).

## Artefato e como regenerar

| Item | Onde |
|------|------|
| **PDF distribuível** | `Docs/berkahn-institucional-v2.pdf` (9 páginas A4 retrato, 7.6MB) |
| Página fonte (noindex) | `berkahn.com.br/institucional/pdf` |
| Rota de geração | `GET /api/institucional/pdf` (esconde o badge do Next dev; `?dpr` NÃO muda tamanho — `page.pdf` é vetorial) |
| **Copy (fonte da verdade)** | `lib/institucional-data.ts` |
| **Sistema visual** | `app/institucional/pdf/institucional.module.css` |
| Componentes | `components/institucional/pdf/*.tsx` (9 páginas) |

**Regenerar após editar copy/design** (requer `CHROME_LOCAL_PATH` no `.env.local`, já configurado):

```powershell
npm run dev
Invoke-WebRequest "http://localhost:3000/api/institucional/pdf" -OutFile "Docs/berkahn-institucional-v2.pdf"
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
- 2026-07-10 — **v2 "Monografia editorial"** (branch `design/institucional-monografia`). Redesign completo dos 9 componentes + `institucional.module.css`; Playfair Display, mono estrito, fotografia full-bleed. Conteúdo (`lib/institucional-data.ts`) e infra de geração preservados. Otimização de imagens via `optImg()` (31 MB → 7.6 MB). Workflow diferente do [[workflow-material]] padrão (Canva): gerado pelo pipeline de PDF do site.
