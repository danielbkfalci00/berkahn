<%*
const titulo = await tp.system.prompt("Título do artigo", tp.file.title);
const slug = titulo.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
await tp.file.rename(slug);
const seoTitle = await tp.system.prompt("SEO title (<= 60 chars)", titulo);
const seoDesc = await tp.system.prompt(
  "SEO description (150-160 chars)", "", false, true
);
const kw = await tp.system.prompt("Palavras-chave (vírgula)", "");
const dominio = await tp.system.suggester(
  ["lsf", "steel-frame", "drywall", "normas", "financiamento", "sustentabilidade"],
  ["lsf", "steel-frame", "drywall", "normas", "financiamento", "sustentabilidade"],
  false,
  "Domínio (entra em tags domain/X)"
);
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: draft-content
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - project/blog
  - status/draft
  - domain/<% dominio %>
ai_summary: ""
status: draft
projeto: blog
slug: <% slug %>
publicado_em: ""
data_publicacao: ""
title: "<% titulo %>"
description: "<% seoDesc %>"
palavras_chave:
<% kw.split(",").map(k => "  - " + k.trim()).filter(l => l !== "  - ").join("\n") %>
seo_title: "<% seoTitle %>"
seo_description: "<% seoDesc %>"
supabase_id: ""
url_final: "https://www.berkahn.com.br/atualidades/<% slug %>"
linkedin_slug: ""
material_visual_slug: ""
answer_summary: ""
contextos_aplicados:
  - berkahn-brand
  - seo-aeo-strategy
  - article-pipeline
  - copy-sem-travessao
---

# <% titulo %>

<% tp.file.cursor(1) %>

## Introdução

<% tp.file.cursor(2) %>

## Desenvolvimento

### <% tp.file.cursor(3) %>

### <% tp.file.cursor(4) %>

## Conclusão

<% tp.file.cursor(5) %>

## CTA

<% tp.file.cursor(6) %>

---

<!-- vault-rodape-v1 -->
**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[article-pipeline]] · [[copy-sem-travessao]] · [[steel-frame-domain]]
**Atomic knowledge disponível** (linkar quando aplicável): [[lsf-normas-nbr]] · [[lsf-custos]] · [[lsf-cronograma]] · [[lsf-fogo]] · [[lsf-acustica]] · [[lsf-financiamento]] · [[lsf-vs-alvenaria]] · [[lsf-fundacao]] · [[lsf-sustentabilidade]] · [[lsf-versatilidade-arquitetonica]]
**Material visual**: [[indices-capas-blog]] (escolher arquivo ou rodar `/material` para gerar briefing)
**Cross-post**: rodar `/linkedin` após `/artigo` para gerar post correspondente
**Hub**: [[blog]] · **Workflow**: [[workflow-conteudo]]
