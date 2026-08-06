---
tipo: documentacao
criado: 2026-08-06
atualizado: 2026-08-06
tags:
  - project/linkedin
  - status/archived
ai_summary: "Esta pasta é acervo congelado. Desde 2026-08-06 o texto de post de LinkedIn vive em conteudo_pautas.linkedin_texto, editável em /admin/conteudo/[id] — o /linkedin grava lá e não cria mais pasta aqui. As pastas existentes ficam como registro do que foi feito antes."
status: archived
projeto: linkedin
---

# LinkedIn — acervo anterior

> [!warning] Não crie pasta nova aqui
> Desde **2026-08-06**, o texto do post vive em `conteudo_pautas.linkedin_texto` e o prompt da imagem em `linkedin_imagem_prompt`. Edição em `/admin/conteudo/[id]`. O `/linkedin` grava direto lá.

## Por que congelado e não apagado

As pastas abaixo têm frontmatter válido, wikilinks e o rodapé padrão — `vault-validate.mjs` as valida, e o hub [[linkedin]] conta `kpi_publicados` a partir delas. Apagar quebraria o linter e o KPI de uma vez.

Além disso, `2026-06-16-painelizado-vs-stick/imagem-final.png` é o único lugar onde aquela imagem existe.

## O que está aqui

| Pasta | Artigo de origem |
|---|---|
| `2026-04-13-medstar-gestao-obra` | — |
| `2026-06-16-painelizado-vs-stick` | `sistema-painelizado-vs-stick-steel-frame` |
| `2026-07-14-energia-solar` | `energia-solar-residencial` |
| `2026-08-05-icms-solar-sp` | `isencao-icms-energia-solar-sp` |

Nenhuma foi migrada para o banco: casam por `artigo_slug` do frontmatter, não por id, e um match errado custa mais do que os quatro cards valem. Se quiser trazer alguma, é `pauta.mjs gravar` à mão.

## Onde o fluxo vive agora

Contexto completo em [[quadro-conteudo]]. Hub do projeto: [[linkedin]].
