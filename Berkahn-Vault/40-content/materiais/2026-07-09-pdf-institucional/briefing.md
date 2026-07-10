---
tipo: meta
criado: 2026-07-09
atualizado: 2026-07-09
tags:
  - project/material
  - project/site
  - source/manual
  - status/active
ai_summary: Documento institucional PDF "O que fazemos" (9 páginas A4, monocromático Manrope) para enviar a clientes que perguntam o que a Berkahn executa. Gerado pelo pipeline Puppeteer do site (rota /institucional/pdf + /api/institucional/pdf). Artefato em Docs/berkahn-institucional-v1.pdf (3.9MB). Copy centralizada em lib/institucional-data.ts.
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

## Artefato e como regenerar

| Item | Onde |
|------|------|
| **PDF distribuível** | `Docs/berkahn-institucional-v1.pdf` (9 páginas A4 retrato, 3.9MB, dpr=1.5) |
| Página fonte (noindex) | `berkahn.com.br/institucional/pdf` |
| Rota de geração | `GET /api/institucional/pdf` (param `?dpr=1.5` p/ arquivo leve, default 2 p/ nitidez máxima) |
| **Copy (fonte da verdade)** | `lib/institucional-data.ts` |
| Componentes | `components/institucional/pdf/*.tsx` (9 páginas) |

**Regenerar após editar copy** (requer `CHROME_LOCAL_PATH` no `.env.local`, já configurado):

```powershell
npm run dev
Invoke-WebRequest "http://localhost:3000/api/institucional/pdf?dpr=1.5" -OutFile "Docs/berkahn-institucional-v1.pdf"
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

Design conforme [[design-principles]] (monocromático preto/branco/off-white #F4F2EC, Manrope) e voz conforme [[berkahn-brand]] (terminologia Light Steel Frame/LSF, sem vícios de IA). Domínio técnico: [[steel-frame-domain]], [[lsf-normas-nbr]], [[lsf-fundacao]].

## Histórico

- 2026-07-09 — v1 criada (branch `feat/institucional-pdf`, 3 commits). Workflow diferente do [[workflow-material]] padrão (Canva): este material é gerado pelo pipeline de PDF do site (padrão orçamento), decisão registrada no plano da sessão.
