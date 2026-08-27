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

Antes de cada escrita, rode `node scripts/conteudo/pauta.mjs proxima <id> --json`, capture `atualizado_em` e passe `--expected-updated-at=<valor>`. Depois de uma escrita bem-sucedida, carregue novamente antes da próxima; isso impede sobrescrever uma edição feita no admin.

## /artigo produzir <pauta-id> <draft.md>

1. Leia a pauta com:
   ```bash
   node scripts/conteudo/pauta.mjs ver <pauta-id>
   ```
2. **Entregue o prompt da capa em inglês**, do mesmo jeito que o `/linkedin`
   entrega o da imagem do post. Não existe capa sem direção escrita: o prompt
   locked só define caminho, formato e alt text. Âncora em
   `Berkahn-Vault/50-brand/guia-design-berkahn.md` — preto `#000000`, branco
   `#FFFFFF`, cinzas `#1A1A1A` e `#666666`, sem cor de acento. Regras da capa:

   - **sem texto na imagem.** A página renderiza o título como hero por cima da
     capa; texto embutido duplica o título e quebra no mobile;
   - 1200×800, assunto deslocado para um dos terços laterais, porque o gradient
     overlay escurece o centro e engole o que estiver lá;
   - obra real de Light Steel Frame com luz natural. Nada de render de banco de
     imagem, nada de pessoa posando com EPI;
   - o tema precisa ser reconhecível na miniatura, que é do tamanho de um
     card no Discover e no compartilhamento.

   Gere, salve dentro do workspace e suba a capa pelo card antes de produzir.
3. Confirme que o markdown está em
   `Berkahn-Vault/40-content/blog/drafts/[slug].md`, registrado em `draft_path`,
   e que a capa staging foi enviada no card.
4. Execute o prompt LOCKED: transforme placeholders em `components` JSONB e
   monte o objeto do post. Valide antes de gravar:
   - `meta_title` até 60 caracteres, keyword nos primeiros 30;
   - `meta_description` entre 150 e 160 caracteres;
   - `answer_summary` entre 80 e 120 palavras, com dado quantitativo;
   - 3 a 5 tags, mínimo 3 FAQs e 3 a 5 links internos;
   - categoria em: Guias e Tutoriais, Tecnologia e Inovação, Mercado e
     Custos, Segurança e Normas ou Sustentabilidade. Esta lista canônica
     substitui apenas a taxonomia antiga do prompt locked, sem editá-lo.
5. Grave o objeto do post em JSON temporário no scratchpad da sessão, nunca em
   scripts descartáveis por artigo.
6. Faça primeiro o dry-run e, se passar, produza:
   ```bash
   node scripts/conteudo/pauta.mjs produzir <pauta-id> --arquivo=<draft.md> --dados=<post.json> --expected-updated-at=<atualizado_em> --dry-run
   node scripts/conteudo/pauta.mjs produzir <pauta-id> --arquivo=<draft.md> --dados=<post.json> --expected-updated-at=<atualizado_em>
   ```
   O CLI cria ou atualiza `posts` como `draft`, vincula `post_id`, converte
   a capa para `public/images/img_blog/[slug]/cover.webp` e avança Blog para
   `produzido`. Se o slug já existir sem vínculo, pare; `--usar-existente`
   exige confirmação humana.
7. Entregue o link do card para aprovação manual. Não altere para `aprovado`
   por automação.

## /artigo publicar <pauta-id>

1. Leia a pauta e confirme que `status_blog = aprovado`.
2. Rode:
   ```bash
   node scripts/conteudo/pauta.mjs publicar <pauta-id> --expected-updated-at=<atualizado_em> --dry-run
   node scripts/conteudo/pauta.mjs publicar <pauta-id> --expected-updated-at=<atualizado_em>
   ```
3. O CLI move o markdown de `drafts/` para `publicados/`, atualiza o
   frontmatter e publica post+pauta por RPC idempotente. Se o banco falhar, ele
   restaura o markdown no caminho original e reporta o estado.
4. Valide a URL final e lembre o Bruno de solicitar indexação no Google Search
   Console.

Nunca crie `add-article-[slug].mjs`. Nunca use `--forcar` ou
`--usar-existente` sem confirmação explícita.

$ARGUMENTS
