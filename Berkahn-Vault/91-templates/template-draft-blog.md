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
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: draft-content
status: draft
criado: <% hoje %>
atualizado: <% hoje %>
publicado_em: ""
tags:
  - project/blog
  - status/draft
slug: <% slug %>
seo_title: "<% seoTitle %>"
seo_description: "<% seoDesc %>"
palavras_chave:
<% kw.split(",").map(k => "  - " + k.trim()).filter(l => l !== "  - ").join("\n") %>
supabase_id: ""
url_final: "https://berkahn.com.br/atualidades/<% slug %>"
ai_summary: ""
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
