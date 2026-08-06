---
description: Escrever artigo final com base na pesquisa
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/berkahn-brand.md` — identidade e voz
- `Berkahn-Vault/20-context/seo-aeo-strategy.md` — regras de SEO/AEO
- `Berkahn-Vault/30-prompts/blog-criacao.md` — prompt de criação (LOCKED)

Escreva o artigo final seguindo todas as regras do prompt de criação, com base na pesquisa feita anteriormente nesta conversa.

Se a pesquisa foi de outra sessão, ela está na **pauta**, não no vault — desde
2026-08-06 o `/pesquisa` grava no banco:

```bash
node scripts/conteudo/pauta.mjs buscar "<termo do tema>"
node scripts/conteudo/pauta.mjs ver <id>     # mostra o bloco Pesquisa completo
```

`40-content/blog/pesquisa/` está vazia e saiu do fluxo — não procure lá.

Checklist obrigatório antes de entregar:
- Max 2.500 palavras
- Sem bullets no corpo (exceto FAQ)
- Sem vícios de linguagem proibidos (ver [[copy-sem-travessao]])
- LSF explicado na primeira menção (ver [[steel-frame-domain]])
- Todo dado com contexto/fonte
- Público-alvo definido

**Arquivar draft no vault:**
Salvar o artigo final em `Berkahn-Vault/40-content/blog/drafts/[slug].md` com frontmatter completo (tipo: draft-content, status: draft, slug, seo_title, seo_description, palavras_chave, ai_summary, tags: project/blog, status/draft). Usar template `Berkahn-Vault/91-templates/template-draft-blog.md` como base.

Registre o caminho na mesma pauta e avance Blog para `draft`:

```bash
node scripts/conteudo/pauta.mjs registrar-draft <id> --arquivo=Berkahn-Vault/40-content/blog/drafts/[slug].md --dry-run
node scripts/conteudo/pauta.mjs registrar-draft <id> --arquivo=Berkahn-Vault/40-content/blog/drafts/[slug].md
```

Após `/criacao`, o próximo passo é
`/artigo produzir <id> Berkahn-Vault/40-content/blog/drafts/[slug].md`.

$ARGUMENTS
