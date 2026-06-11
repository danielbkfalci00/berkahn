<%*
const projeto = await tp.system.suggester(
  ["blog", "linkedin", "site", "seo-aeo", "apresentacoes", "materiais", "pesquisas", "comercial"],
  ["blog", "linkedin", "site", "seo-aeo", "apresentacoes", "materiais", "pesquisas", "comercial"],
  false,
  "Projeto associado"
);
const pathExterno = await tp.system.prompt("Path relativo (ex: ../../../../Docs/Imagens/Comercial)", "../../../../Docs/");
const titulo = await tp.system.prompt("Título do índice", tp.file.title);
const slug = titulo.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
await tp.file.rename(slug);
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: indice
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - project/<% projeto %>
  - source/manual
ai_summary: "Índice de binários (imagens/PDFs/assets) em <% pathExterno %> — não migrado por tamanho/formato. Path relativo permite Read direto do Claude via Bash."
status: active
projeto: <% projeto %>
path_externo: "<% pathExterno %>"
arquivos_total: 0
---

# Índice — <% titulo %>

> **Localização externa**: `<% pathExterno %>` (fora do vault por tamanho/formato).
> Esta nota mantém o conteúdo visível para Claude/Bruno sem inflar o vault. Catálogo manual; atualizar quando subpasta crescer.

## Catálogo

<% tp.file.cursor(1) %>

| Arquivo | Tipo | Uso em | Notas |
|---------|------|--------|-------|
| `arquivo1.ext` | — | [[contexto]] | |

## Quando usar

<% tp.file.cursor(2) %>

## Como ler binários

```bash
# Listar conteúdo da pasta externa (path relativo a partir desta nota)
ls "<% pathExterno %>"
```

Para imagens/PDFs específicos, use Read direto com path absoluto (ferramenta Read suporta imagens).

## Manutenção

- Atualizar `arquivos_total` quando adicionar/remover binários
- Atualizar tabela de catálogo com novos arquivos relevantes
- Linkar para artigos/posts/apresentações que consomem cada asset
