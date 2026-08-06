---
description: Produzir ou publicar artigo vinculado a uma pauta
---

Leia:
- `Berkahn-Vault/20-context/article-pipeline.md`
- `Berkahn-Vault/20-context/seo-aeo-strategy.md`
- `Berkahn-Vault/30-prompts/article-implementation-prompt.md` (LOCKED)

Este comando tem duas operações explícitas. Não publique como efeito colateral de
produzir. Se `$ARGUMENTS` não começar com `produzir` ou `publicar`, pergunte
qual operação o Bruno quer.

## /artigo produzir <pauta-id> <draft.md>

1. Leia a pauta com:
   ```bash
   node scripts/conteudo/pauta.mjs ver <pauta-id>
   ```
2. Confirme que o markdown está em
   `Berkahn-Vault/40-content/blog/drafts/[slug].md`, registrado em `draft_path`,
   e que a capa staging foi enviada no card.
3. Execute o prompt LOCKED: transforme placeholders em `components` JSONB e
   monte o objeto do post. Valide antes de gravar:
   - `meta_title` até 60 caracteres, keyword nos primeiros 30;
   - `meta_description` entre 150 e 160 caracteres;
   - `answer_summary` entre 80 e 120 palavras, com dado quantitativo;
   - 3 a 5 tags, mínimo 3 FAQs e 3 a 5 links internos;
   - categoria em: Guias e Tutoriais, Tecnologia e Inovação, Mercado e
     Custos, Segurança e Normas ou Sustentabilidade. Esta lista canônica
     substitui apenas a taxonomia antiga do prompt locked, sem editá-lo.
4. Grave o objeto do post em JSON temporário no scratchpad da sessão, nunca em
   scripts descartáveis por artigo.
5. Faça primeiro o dry-run e, se passar, produza:
   ```bash
   node scripts/conteudo/pauta.mjs produzir <pauta-id> --arquivo=<draft.md> --dados=<post.json> --dry-run
   node scripts/conteudo/pauta.mjs produzir <pauta-id> --arquivo=<draft.md> --dados=<post.json>
   ```
   O CLI cria ou atualiza `posts` como `draft`, vincula `post_id`, converte
   a capa para `public/images/img_blog/[slug]/cover.webp` e avança Blog para
   `produzido`. Se o slug já existir sem vínculo, pare; `--usar-existente`
   exige confirmação humana.
6. Entregue o link do card para aprovação manual. Não altere para `aprovado`
   por automação.

## /artigo publicar <pauta-id>

1. Leia a pauta e confirme que `status_blog = aprovado`.
2. Rode:
   ```bash
   node scripts/conteudo/pauta.mjs publicar <pauta-id> --dry-run
   node scripts/conteudo/pauta.mjs publicar <pauta-id>
   ```
3. O CLI move o markdown de `drafts/` para `publicados/`, atualiza o
   frontmatter e publica post+pauta por RPC idempotente. Se o banco falhar, ele
   restaura o markdown no caminho original e reporta o estado.
4. Valide a URL final e lembre o Bruno de solicitar indexação no Google Search
   Console.

Nunca crie `add-article-[slug].mjs`. Nunca use `--forcar` ou
`--usar-existente` sem confirmação explícita.

$ARGUMENTS
