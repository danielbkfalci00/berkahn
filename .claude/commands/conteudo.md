---
description: Produzir uma pauta ponta a ponta até aprovação e publicar após confirmação humana
---

Este é o orquestrador único do pipeline. Ele reutiliza `/pesquisa`, `/criacao`,
`/artigo` e `/linkedin`; não replica seus prompts nem altera arquivos `locked`.

Interprete `$ARGUMENTS` assim:

- `produzir [pauta-id]`: continuar uma pauta até o pacote de aprovação. Sem id,
  selecionar deterministicamente o próximo trabalho.
- `aprovar [pauta-id] [blog|linkedin|ambos]`: registrar a decisão humana expressa
  nesta conversa; publicar o Blog e preparar o pacote manual do LinkedIn.
- `status [pauta-id]`: somente leitura, sem escrita.

Também aceite linguagem natural equivalente, como “Produza o próximo conteúdo”
e “Aprovo”. Nunca trate silêncio, elogio ou pedido de ajuste como aprovação.

## Guardrails do run

- Uma pauta por run; no máximo 8 transições, 45 minutos, uma nova tentativa por
  erro transitório e aproximadamente 90 mil tokens de entrada/20 mil de saída.
- Pare em autenticação, validação, conflito de versão, orçamento, fonte técnica
  insuficiente ou pedido de aprovação.
- Antes de cada escrita, recarregue `atualizado_em`; use sempre
  `--expected-updated-at`. Nunca use `--forcar`, `--usar-existente` ou publique
  por inferência.
- Carregue somente metadados no início. Use `--include` apenas para os blocos da
  etapa atual; não coloque pesquisa, draft e LinkedIn completos juntos no contexto.
- Status é posição livre. Publicação real depende de `posts.status=published` no
  Blog e URL+data no LinkedIn.
- O worker antigo permanece pausado. Não o reative e não crie cron, LangGraph,
  n8n local ou uma segunda máquina de estados.

## Produzir

1. Se não houver id:

   ```bash
   node scripts/conteudo/pauta.mjs selecionar --escopo=pacote --json
   ```

   A seleção prioriza aprovação pendente, fila, trabalho em curso, data, prioridade
   e ordem. Não crie pauta automaticamente.

2. Com id, rode:

   ```bash
   node scripts/conteudo/pauta.mjs proxima <id> --json
   ```

   Se houver job `executando`, pare para evitar concorrência. Se houver job
   `aguardando-aprovacao`, apenas reconstrua o pacote de aprovação. Se houver job
   `na-fila`, faça claim com um `worker` único da sessão, confirme que a pauta e a
   ação retornadas são as selecionadas e finalize o job com seus hashes/tokens/custo.

3. **Leia o desempenho antes de escrever.** Pauta de custo, preço ou "quanto
   custa" quase sempre colide com artigo já indexado, e descobrir isso com o
   draft pronto custa a semana inteira:

   ```bash
   node scripts/conteudo/pauta.mjs buscar --slug=<slug-candidato>
   ```

   Leia também o relatório mais recente em
   `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.md`, que o
   `/performance` já gera com impressões, cliques e indexação por slug. Não chame
   GA4 nem GSC dentro do run: o relatório do mês é a fonte e custa uma leitura.

   Declare no pacote de aprovação qual dos dois casos é:

   - **artigo novo**: nenhum publicado disputa a intenção da keyword;
   - **reposicionamento**: já existe URL indexada. O alvo passa a ser o slug
     existente, `--usar-existente` entra com confirmação humana e a migration 030
     mantém a revisão staged. Abrir slug novo aqui joga fora o histórico e
     canibaliza a própria página.

4. Execute um loop limitado pela `proxima_acao`, sempre relendo a pauta:

   - `pesquisar`: siga `.claude/commands/pesquisa.md`, pesquise fontes atuais e
     primárias, grave pesquisa e insights pelo CLI.
   - `criar-draft`: carregue somente pesquisa+insights, siga
     `.claude/commands/criacao.md`, escreva no path canônico e registre `draft_path`.
     Se o card ainda estiver sem taxonomia, espelhe somente tags canônicas `domain/*`
     com `pauta.mjs tags`; não invente tags livres.
   - `produzir-artigo`: siga `.claude/commands/artigo.md`. Gere a capa Blog; salve
     o arquivo dentro do workspace e envie primeiro com:

     ```bash
     node scripts/conteudo/pauta.mjs capa <id> --canal=blog --arquivo=<imagem> --expected-updated-at=<versao> --dry-run
     node scripts/conteudo/pauta.mjs capa <id> --canal=blog --arquivo=<imagem> --expected-updated-at=<versao>
     ```

     Depois recarregue a versão e produza/atualize o post como draft. Se já existir
     post com mesmo slug sem vínculo, pare e peça confirmação.
   - `produzir-linkedin`: siga `.claude/commands/linkedin.md`; grave texto, prompt e
     briefing. Gere a capa 1080×1350 com a ferramenta de imagem disponível e envie
     com `pauta.mjs capa --canal=linkedin`. Se a ferramenta não estiver disponível,
     preserve prompt+briefing e exponha o gap; não simule arquivo criado.
     Antes de gravar, execute o filtro de humanização do prompt: hook em situação
     concreta do público, alvo de 110–140 palavras, leitura em voz alta, redução
     final de 20%–30% quando estiver explicativo e CTA que nomeie a ajuda prática.
   - `revisar`: valide SEO/AEO, fontes, consistência técnica, links, artefatos e
     publicação real. Não aprove. Pare e entregue o pacote abaixo.
   - `preparar-publicacao`: não publique no LinkedIn; entregue copy, capa e URL UTM.

5. Pacote de aprovação, curto e verificável:

   - pauta, título, slug e keyword;
   - resumo das fontes e riscos factuais;
   - preview/link do artigo draft;
   - texto do LinkedIn e URL parametrizada;
   - previews das duas capas;
   - gaps restantes e gates executados;
   - opções explícitas: `Aprovo tudo`, `Aprovo só Blog`, `Aprovo só LinkedIn`,
     `Quero ajustes`.

## Aprovar

Só execute após uma confirmação humana explícita nesta conversa e para a pauta
inequívoca do pacote anterior. Se não houver contexto inequívoco, peça o id.

1. Recarregue a pauta, faça dry-run e registre a aprovação nos canais confirmados:

   ```bash
   node scripts/conteudo/pauta.mjs aprovar <id> --canais=<canais> --confirmar-aprovacao-humana --expected-updated-at=<versao> --dry-run
   node scripts/conteudo/pauta.mjs aprovar <id> --canais=<canais> --confirmar-aprovacao-humana --expected-updated-at=<versao>
   ```

2. Se Blog foi aprovado, recarregue a versão e execute `/artigo publicar` com
   dry-run antes da escrita. O CLI pode substituir com rollback uma nota publicada
   antiga do mesmo slug. Valide a URL pública; status manual nunca basta.
3. LinkedIn continua humano: devolva texto, capa 4:5 e
   `url_linkedin_parametrizada`. Depois da postagem, peça a URL e a data reais para
   registrar no card. Não marque LinkedIn como publicado antes disso.
4. Informe exatamente o que foi publicado, o que permanece manual e qualquer
   limpeza retryável. Nunca esconda um gap atrás de status.
5. **Feche a documentação no mesmo run.** O que fica só no chat morre com a
   sessão. Atualize o que já existe, sem criar nota nova:

   - o hub do canal (`00-meta/projetos/blog.md`, `linkedin.md`): marque o que
     fechou, cite commit ou URL e bata `atualizado`;
   - `00-meta/projetos/sprint-ativa.md`, se a pauta era da sprint;
   - `00-meta/CHANGELOG.md` somente quando o run mudou schema, CLI ou fluxo;
   - a pendência do LinkedIn em sintaxe canônica, porque URL e data só existem
     depois que o Bruno posta:

     `- [ ] @bruno Publicar no LinkedIn com a UTM entregue e registrar URL e data reais #pendencia`

   - **a pendência de indexação, sempre que um artigo for publicado:**

     `- [ ] @bruno Solicitar indexação de <url> no Search Console #pendencia`

     Publicar não coloca o artigo na busca, e estar no sitemap também não. Em
     2026-08-25 os dois artigos publicados por este fluxo estavam em
     `Discovered - currently not indexed` com `lastCrawlTime` **nunca**, um deles
     havia uma semana, os dois no sitemap desde a publicação. O pedido manual no
     Search Console levou ambos a `Crawled` no mesmo dia.

     A API de indexação do Google não resolve, porque aceita apenas `JobPosting`
     e `BroadcastEvent`. O passo é do Bruno, então precisa estar escrito e não
     lembrado: o `/artigo publicar` já pedia para "lembrar o Bruno" e isso falhou
     nas duas publicações seguidas.

     Confira o estado antes e depois com:

     ```bash
     node --env-file=.env.local scripts/analytics/adhoc-inspect-urls.mjs <slug>
     ```

   Encerre com `node scripts/vault-validate.mjs`, que precisa sair em 0 issues.
   Aprendizado de calibragem de copy vai para `30-prompts/`, e ali **exige
   permissão explícita do Bruno**: aqueles arquivos são locked.

## Status

Rode `pauta.mjs selecionar --escopo=pacote --json` ou `pauta.mjs proxima <id> --json` e resuma sem
alterar banco, arquivos ou jobs.

$ARGUMENTS
