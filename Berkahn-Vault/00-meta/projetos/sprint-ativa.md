---
tipo: meta
criado: 2026-05-21
atualizado: 2026-08-14
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: "Sprint 10–14/08: migration 030 e /conteudo validados no primeiro fluxo real. O Blog de casa LSF 100 m² foi atualizado sem retirar a URL do ar; LinkedIn está aprovado e aguarda publicação manual com URL+data."
status: active
projetos_em_curso:
  - blog
  - linkedin
  - site
  - seo-aeo
  - apresentacoes
  - materiais
  - pesquisas
  - orcamento-automacao
semana_inicio: 2026-08-10
semana_fim: 2026-08-14
---

# Sprint Ativa — semana de 2026-08-10

> [!info] Infraestrutura editorial exercitada numa pauta real
> [[quadro-conteudo]] conduziu pesquisa, draft, artigo, LinkedIn e capas da pauta
> de casa LSF de 100 m². O Blog foi publicado com o slug preservado; LinkedIn
> está aprovado e aguarda publicação manual com URL+data.

> Atualizado segunda-feira via `/standup` (auto seg 9h via scheduled-task). Referenciado em [[CLAUDE]] vault-level e em `vault-manifest.json` (`paths.sprint_doc`). Para detalhes por projeto, abrir o hub correspondente. Validação: `node scripts/vault-validate.mjs` → 0 issues.

## Objetivo da semana

**Fechar o modelo operacional do conteúdo**: separar Blog e LinkedIn, tornar
reordenação/publicação atômicas, versionar a automação genérica e alinhar o
vault. A primeira pauta real já chegou a draft; resta concluir produção,
publicação manual do LinkedIn e registro de URL+data no rollout já deployado.

## Status por projeto

| Projeto | Status | Bloqueio principal | Próxima ação |
|---------|--------|--------------------|--------------|
| [[blog]] | active | Sem bloqueio na pauta de 100 m²; revisão publicada com slug preservado | Medir CTR e leads na janela de 28 dias |
| [[linkedin]] | active | Copy e capa aprovadas; publicação externa é manual | Postar com UTM e registrar URL/data reais |
| [[site]] | active | Smoke autenticado e assinatura push em dispositivo pendentes; Pages legado exige conta com admin | Exercitar CRM logado, ativar push e despublicar Pages em Settings |
| [[seo-aeo]] | active | 3 URLs fora do índice (ação manual no GSC) | Pedir indexação das 3 |
| [[apresentacoes]] | active | Roteiros não versionados (parcial) | Validar 16 slides em live env |
| [[00-meta/projetos/materiais|materiais]] | active | **Institucional PDF v4** aguarda briefing atualizado + distribuição | Atualizar briefing v3→v4; distribuir; preencher `usado_em` |
| [[pesquisas]] | active | Nenhum bloqueio operacional no card | Validar a composição de custos com uma planilha Berkahn anonimizada |
| [[orcamento-automacao]] | published | Smoke test E2E prod pendente (Bruno) | Gerar PDF BRK-2026-0001 (checar pgs/peso) |

## Bloqueios consolidados (cross-projeto)

### Entrega final do quadro — 2026-08-07

- [x] Migrations 021–023 aplicadas e verificadas em transação: view leve, escrita
  atômica de metadados+tags, reorder de analytics, heartbeat do worker,
  snapshots de 28 dias e label UTF-8
- [x] Visão Geral convertida em agenda com quatro grupos, filtros persistidos na
  URL e paginação inicial de 18 cards; Kanbans por canal preservados
- [x] Tráfego do admin excluído do GA e banner de consentimento removido das
  rotas internas
- [x] Gates de CI versionados: lint, typecheck, testes de conteúdo, testes do
  aprendizado e build
- [ ] @bruno Redesenhar o worker para execução sob demanda ou heartbeat leve antes de reativá-lo; o agendamento antigo aponta para worktree removido, o heartbeat está obsoleto e uma task completa a cada 15 minutos tem custo desnecessário #pendencia
- [x] **GA4 fechado em 10/08**: OAuth com `analytics.edit`; dimensões `article_slug` e `percent_scrolled` registradas na propriedade 516973519
- [x] Migrations 024–029 do CRM aplicadas; RLS canônica, atomicidade, retenção/remoção de anexos e outbox push sem PII verificadas em transação revertida
- [x] **PR #53 mergeada e deployada em 11/08**: commit `5121941`, Quality verde e deploys `berkahn` + `berkahn-admin` concluídos. Smoke público confirmou site 200, política Supabase-only e redirecionamento do admin para login
- [x] **Retenção e Web Push ativados em 14/08**: Edge Function `lead-retention` v1 e cron mensal ativos; VAPID/segredo configurados e dispatcher agendado a cada 15 minutos. O rollout encontrou zero candidatos e zero objetos pendentes
- **Pendências de rollout**: smoke autenticado e GitHub Pages vivem uma única vez em [[site#Próximos 7 dias]].
- **Primeira pauta real**: estado e tarefas vivem em [[blog#Próximos 7 dias]], [[linkedin#Próximos 7 dias]] e [[pesquisas#Bloqueios ativos]].

### P0 — Esta semana
- [x] **Migration 012 aplicada**: 66 pautas preservadas, distribuição 44/22,
  ICMS ligado ao post e trilhas independentes verificadas por teste transacional
- [x] **Migration 013 aplicada**: `coluna`, `ordem` e o índice legado removidos
  em produção; 66 pautas preservadas e suíte transacional verde
- [x] **Quadro compatível**: abas Geral/Blog/LinkedIn, estados derivados,
  busca/filtros, ações em lote sem aprovação, renomeação, prontidão e publicação manual do LinkedIn
- [x] **Automação genérica**: `pauta.mjs` versionado; criar, gravar,
  registrar-draft, produzir e publicar com dry-run/rollback
- [x] **Smoke autenticado crítico em preview e produção**: data inline,
  livre sem gaps, tags, clipboard com clique real, upload/troca/remoção das
  capas Blog e LinkedIn 4:5, redirecionamento de sessão expirada e leitura das
  66 pautas. RPC transacional cobre drag/order; ICMS cobre vínculo no banco
- **Fluxo editorial E2E restante**: acompanhar pelas tarefas canônicas de [[blog]],
  [[linkedin]] e [[pesquisas]]. Pesquisa e criação foram exercitadas na pauta
  `71592c33-9637-49d4-ac1d-153b422188af` em 11/08.
- [x] ~~**Merge PR #17**~~ ✅ 2026-07-30 — #15, #16 e #17 mergeados. **Sobrou**: validar `/institucional/pdf` em prod, atualizar o briefing para v4 e distribuir o PDF. Ver [[site]] e [[00-meta/projetos/materiais|materiais]]
- [x] **Indexação Google** ([[seo-aeo]]): **encerrado em 2026-07-29** — 34/38 artigos (89%), contra 6/44 em abril. Restam 4 URLs em "Crawled/Discovered - currently not indexed", agora P1
- [x] ~~**Publicar OAuth consent screen**~~ ✅ 2026-07-30 — app em produção, refresh voltou a funcionar, token reemitido. Ver [[google-apis-setup]]
- [ ] @bruno Decidir o destino das 4 capas órfãs em [[00-meta/projetos/materiais|materiais]]: Reestruturando Concreto, energia_solar, mármore e piscina_arraia #pendencia
- [x] ~~**Smoke test Supabase**~~ ✅ 2026-07-30 — rodado, 6 slugs vault-only confirmados

### P1 — Próximas 2 semanas
- [x] Aplicar migration 013 após o deploy compatível;
  remover `coluna`, `ordem` e índice legado
- [x] **Higiene da service key histórica verificada**: varredura em 405 arquivos
  de `scripts/` encontrou zero JWT Supabase e zero chave `sb_secret_` hardcoded
- [x] **4 erros de frontmatter em `40-content/curadoria/`** (vault health): corrigidos em 2026-07-02 (PR #11) — `status`/`tipo` inválidos normalizados. `vault-validate.mjs` → 0 issues. Chip `task_abaacde6` fechado.
- [x] **Supabase consolidado como custódia de PII**: banco do CRM em produção e admin implementado; planilha e Apps Script foram retirados do caminho operacional em 11/08
- [x] ~~**9 posts sem meta_title/meta_description**~~ ✅ 2026-07-30 — eram os 9 artigos com menos de 55 palavras. 5 em 301, 4 em noindex. Ver [[2026-07-thin-content-mapa]]
- [x] ~~**4 posts sem answer_summary**~~ ✅ 2026-07-30 — preenchidos, 98 a 102 palavras cada

### P2 — 2-4 semanas
- [ ] Integração externa para publicar LinkedIn; até lá, URL + data são manuais
- [ ] **Fase 4 MCPs** (opcional): HubSpot leads sync · n8n KPIs · Figma tokens
- [x] **Capas consolidadas** em `Docs/banco-imagens/capas-blog/` (2026-07-01): dedup por hash concluído; par PNG/WEBP `lsf-mundial` mantido de propósito (PNG master + WEBP em produção). Path antigo `Docs/Conteúdo/Capas blog/` não existe mais.
- [ ] **Migrar slugs ambíguos** ([[blog]]): 2 TODOs no SLUG_MAP do `vault-backfill-articles.mjs`

## Standup 2026-07-20

Nota completa: [[2026-07-20]]. Standup de 07-13 não disparou — base de comparação é 2026-07-06 (~2 semanas). **Delta principal**: novo deliverable **Documento Institucional PDF "O que fazemos"** (9 páginas, v1 PR #14 → v2 rejeitado "muito Claude" → **v3 blueprint suíço-brutalista**, branch `design/institucional-monografia` → PR #17 pendente merge; artefato `Docs/berkahn-institucional-v3.pdf` 6.7MB; infra em `app/institucional/pdf/` + `lib/institucional-data.ts`). Blog: `kpi_publicados` 37 → 38 (`steel-frame-laje-de-concreto`, 07-08). [[article-pipeline]] +3 aprendizados. Bloqueios P0 SEO (indexação GSC, meta tags, answer_summary) e smoke test orçamento arrastados — aguardam Bruno. KPIs externos não coletados nesta execução automática.

## Standup 2026-07-06 (primeiro standup formal)

Primeira execução do `/standup` (ritual criado 2026-05-22, nunca disparado até hoje). Nota completa: [[2026-07-06]]. Deltas desde 2026-07-01/02: P1 curadoria resolvido (PR #11), 20 WARNs de ordem zerados (PR #12), 2 wikilinks corrigidos (PR #10), fotos do globo/DomeGallery renovadas na apresentação executiva (PR #13). Vault 151 notas / 0 issues. Foco da semana: retomar cadência editorial (blog + LinkedIn) + P0 SEO (indexação GSC — ação Bruno). KPIs externos (indexação, leads, publicados) aguardam input do Bruno.

## Saúde dos crons — apurado em 2026-07-29

Os três `scheduled-tasks` estão **enabled e disparando**. O problema nunca foi agendamento.

| Task | Última execução | Resultado |
|------|-----------------|-----------|
| `berkahn-standup-semanal` | 2026-07-27 09:46 BRT | Rodou a análise inteira (86 entradas) e a sessão morreu na última chamada — o `Write` de `2026-07-27.md` não teve resultado. **Recuperado do transcript** em 29/07 |
| `berkahn-wrapup-semanal` | 2026-07-24 17:07 BRT | **"You've hit your weekly limit · resets Jul 25, 9pm"** após 15 entradas. Perdido, não recuperável |
| `berkahn-performance-mensal` | 2026-07-01 10:23 BRT | `invalid_grant`; recuperado à mão no mesmo dia |

**Diagnóstico**: as falhas têm causas diferentes (limite de uso, morte de sessão, token OAuth), mas o mesmo sintoma — nenhum artefato e nenhum aviso. O `last-error.log` do `performance` só cobre erro lançado pelo script; não cobre sessão que morre nem limite de conta.

**Onde os transcripts ficam**: `~/.claude/projects/C--Users-bruno-Documents-Pessoal-Site-Berkahn/*.jsonl`, um por sessão, com data de modificação batendo com o `lastRunAt`. É onde olhar quando um cron não deixar rastro — e de onde o standup de 27/07 foi recuperado.

## Wins / decisões (2026-08-06) — quadro de conteúdo

Infra integrada em `main` e no ar. A migration 013 foi aplicada em 2026-08-07; detalhe técnico em [[quadro-conteudo]].

**A pauta virou entidade de primeira classe.** `conteudo_pautas` (migrations 010 e 011) com as 66 pautas do calendário ago–dez já semeadas — 44 do calendário mais 22 de LinkedIn do acervo, 22 semanas de 03/08 a 28/12. Quadro Kanban em `/admin/conteudo`, card editável em `/admin/conteudo/[id]` com os seis blocos.

**Acabou a dupla escrita.** `/pesquisa` e `/linkedin` gravam na pauta via `scripts/conteudo/pauta.mjs`. `/criacao` e `/calendario` foram corrigidos junto — um procurava a pesquisa numa pasta que deixou de ser alimentada, o outro contava posts pendentes varrendo uma pasta congelada. Os dois teriam quebrado em silêncio.

**Dois bugs que a verificação pegou, não a leitura de código:**

- **Seis rotas `/api/admin/*` sem autenticação em produção.** O matcher do middleware era `['/', '/admin/:path*']` e não cobria `/api/admin/*`; três das rotas usavam service key, que bypassa RLS. Sem login dava para listar todos os orçamentos com dado pessoal do cliente, apagar por id e pegar signed URL do PDF. Fechado com matcher + `exigirSessao()` nos 10 handlers.
- **O PostgREST não devolve erro quando a RLS filtra a linha** — o update "funciona" e afeta zero linhas. A tela dizia "Salvo às 18:41" com `null` no banco. Em produção seria a sessão expirando com a aba aberta: a pessoa continua escrevendo e perde tudo ao fechar. As oito mutações agora conferem a linha afetada. **Vale para qualquer tabela com RLS neste projeto.**

**Pendências que ficaram:**

- [x] Quadro logado exercitado em preview e produção: salvar data/status/tags, clipboard, capas Blog/LinkedIn e sessão expirada. Vínculo UI e pesquisa ponta a ponta seguem no fluxo editorial E2E acima
- [x] Clipboard validado por clique real do Playwright com permissão explícita do navegador
- [x] Varredura de 405 arquivos em `/scripts` encontrou zero service role JWT e zero `sb_secret_` hardcoded; a pendência histórica não existe mais no disco atual

## Wins / decisões (2026-07-30, tarde)

**Quatro bugs de infraestrutura que já custavam tráfego** — todos verificados em produção ou em build de produção local, não supostos. Ver [[site]] e [[blog]].

- **Soft 404 encerrado**. A causa eram os `loading.tsx` de `/atualidades` (o boundary de Suspense descarrega o shell com 200 antes de o `notFound()` rodar), e foram necessários os **dois** — o pai envolve o segmento `[slug]` também. `revalidate`, o cliente Supabase e a posição do `notFound()` foram testados e descartados um a um. A tabela de hipóteses ficou registrada em [[blog]].
- **`/atualidades/[slug]` nunca foi ISR**. `await cookies()` em `lib/supabase/server.ts` optava a rota por render dinâmico — `revalidate = 60` e `generateStaticParams` eram código morto, e toda visita ao artigo de maior tráfego era SSR frio + round-trip ao banco. Novo `lib/supabase/public.ts` (leitura sem cookies) devolveu a rota para SSG/ISR: 39 caminhos pré-renderizados.
- **`/contato` existia em 4 CTAs e em nenhum lugar mais**. A rota nunca foi criada; a captura de lead só vivia como modal. `ContactForm` extraído do `ContactFormDialog`, agora servindo os dois.
- **`published_at` nulo** no artigo de 17.759 impressões: tirava ele do RSS, deixava o schema sem `datePublished` e fazia o sitemap declarar `lastmod` = agora a cada crawl.

**Instrumentação de conversão no ar** (era a Fase 3, pendente desde o Sprint 4). `ga4_data.events` era `[]` em todos os meses porque `fetch-ga4.mjs` filtrava por 5 nomes que o site não disparava, enquanto os 3 que ele disparava ficavam fora da allowlist. Agora os dois lados espelham a mesma lista, e `cta_click` / `form_submit` / `generate_lead` / `whatsapp_click` saem com `cta_location` e `page_path` — é o que liga pauta a lead. Card de Conversão no Ato 4 do dashboard.

> [!warning] Os números de agosto vão cair, e isso é o comportamento certo
> O consentimento passou a ser respeitado de fato: `consent default denied` antes do `config`, e replay da escolha salva. Antes disso o primeiro `page_view` saía com consentimento presumido e quem recusou era medido assim mesmo. `red-flags.ts` vai disparar `users-drop` no relatório de 01/09 — **é falso positivo desta mudança**. O GSC não é afetado (não depende de cookie): se `users` cair e `clicks` não, é este corte. Detalhes em [[analytics-methodology]].

**Aberto, precisa de dado externo**: `custo-steel-frame-m2-2026` e `quanto-custa-construir-...` usam snapshots diferentes do mesmo índice Arquitecasa para o Sudeste (dez/2025 vs jan/2025). Rebasear a tabela regional exige a série dez/2025 das 5 regiões. **A mesma falta de dado** mantém `orcamento-steel-frame` em backlog — ver [[blog]].

**Precisa do Bruno**: marcar `generate_lead` e `whatsapp_click` como **Key Events** no GA4 Admin (Admin → Eventos). Só faz sentido agora que os eventos existem — antes não havia o que marcar.

## Wins / decisões (2026-07-29)

**PR [#18](https://github.com/danielbkfalci00/berkahn/pull/18) merged, deploy verde nos dois projetos Vercel.**

- **Mês parcial no dashboard**: `/admin/analytics` passa a mostrar o mês corrente com janela cortada no lag do GSC (3 dias) e MoM contra a **mesma contagem de dias** do mês anterior. Badge "Parcial", Comparar desabilitado, ponto vazado no gráfico. Run parcial **não** atualiza os hubs — valores parciais fariam `/standup` narrar queda inexistente. O run do dia 1 sobrescreve automaticamente. Regras em [[analytics-methodology]], operação em `.claude/commands/performance.md`.
- **Julho/2026 (01-26, parcial)**: 1.407 users (↑43,1%), 1.107 cliques (↑54,4%), CTR 3,32% (↑38,3%), posição 4,2. 26 dias já superaram junho inteiro.
- **3 bugs de métrica corrigidos**: (1) indexação contava "not indexed" como indexado — inflava em 1 todo mês desde fevereiro e, na negação, suprimia as ações P0 dessas páginas, o que explica os relatórios com "nenhuma ação P0"; (2) meta usava média de 3 meses, produzindo alvo menor que o mês anterior — atingimento de 150-850% sempre, barra sempre verde; base passou a ser o último mês fechado; (3) `generatedDate` em UTC saía um dia à frente após as 21h.
- **Descoberta que muda a estratégia**: o tráfego virou **98,8% não-branded** (era 100% branded em abril). A meta de chegar a 40% foi superada. A pergunta deixou de ser "como ser descoberto" e passou a ser "como converter quem já chega" — o que conecta com a Fase 3 do plano (não existe CTA no fim dos artigos, e 72% dos pageviews estão lá).
- **Hubs saneados**: [[blog]] e [[seo-aeo]] carregavam KPIs de abril, alguns internamente contraditórios. Tudo reverificado contra Supabase e GSC. Bloqueio P0 de indexação **encerrado** (14% → 89%).
- **Vault reconciliado com produção**: 4 artigos no ar sem contraparte no vault foram reconstruídos do Supabase, incluindo `custo-steel-frame-m2-2026` (78% dos cliques do Google), antes não editável pelo fluxo `/artigo`.
- **Causa raiz do `invalid_grant` identificada** (3ª ocorrência): consent screen provavelmente em modo Testing, onde o refresh token morre em 7 dias. Passo a passo para publicar em [[google-apis-setup]]. **Ação manual pendente do Bruno** — sem isso o cron falha de novo em 01/09.
- **A branch `design/institucional-monografia` está 3 commits atrás de `main`** (merge-base `a149b47`): faltam `02a7709`, `7597ecd` e `2ef61a2`, que adicionam os artigos `energia-solar-residencial` e `anatomia-parede-steel-frame` mais o post LinkedIn de energia solar. Nada foi deletado e o merge não apaga nada — mas contar arquivos em `publicados/` estando nela dá resultado errado. Vale rebasear antes de mergear.

## Wins / decisões (2026-07-29, sessão 2 — estratégia editorial)

**Seção `/admin/documentacoes` criada e calendário editorial até dezembro fechado.**

- **O pipeline de analytics enxergava 20 queries por mês.** `fetch-gsc.mjs:34` pede `rowLimit: 20`; a API aceita 25.000. Toda análise de SEO de fev a jul foi feita sobre o topo de uma distribuição truncada. O real são **1.270 queries em 90 dias, 1.135 delas com zero clique**. Levantado por `scripts/analytics/adhoc-cauda-longa.mjs` (ad-hoc, não altera o pipeline).
- **Canibalização deixou de ser suspeita e virou medida**: em **todas** as queries de preço, `quanto-custa-construir-...` aparece 5 a 20 posições abaixo da página-mãe. 17.759 impressões e CTR de 1,15% contra 2,98%. É a maior perda isolada do acervo.
- **Conteúdo técnico não captura busca**: 139 queries técnicas geraram **3 cliques em 90 dias**. A hipótese de que autoridade técnica traz tráfego está refutada pelo dado, e o calendário foi redesenhado por causa disso.
- **A queda do tráfego de IA (14% → 4,6%) é aritmética, não problema.** ~8 dos 10 pontos são efeito de denominador: o tráfego total dobrou. Mas existe um erro real e separado — `app/robots.ts:13` bloqueia `Google-Extended` com o comentário "no search/citation value", que é **falso**: não protege de AI Overviews e exclui o site do grounding do Gemini, plataforma que foi de 8,9% para 27,3% de fatia.
- **Bug do Search Console contamina fev-abr/2026**: o Google super-reportou impressões de 13/05/2025 a 27/04/2026, sem afetar cliques. Só maio-julho é confiável para leitura de CTR.
- **44 pautas + 44 briefings de LinkedIn** até dezembro, em [[2026-08-calendario-editorial]], com briefing executável em [[2026-08-playbook-pautas]] e base factual em [[2026-07-diagnostico-editorial]]. Serializadas em `ideias/ideas-2026-{08..12}.md` para que `/brainstorm` e `/calendario` enxerguem o funil. **O P0 "pipeline vazio" de [[blog]] está encerrado.**
- **Seção `/admin/documentacoes`**: tabela `documentos` no Supabase com o HTML inline, servido por `/admin/documentacoes/[slug]/raw` dentro de um iframe. Escolha de arquitetura: a Vercel **não sobe o repositório para a Lambda**, então `fs.readFile` do vault funciona em dev e falha com ENOENT em produção. O cron já escreve no Supabase no mesmo run em que renderiza o HTML, então persistir ali não adiciona superfície nova. A rota fica sob `/admin/` e não sob `/api/` porque o matcher do middleware é `['/', '/admin/:path*']` — em `/api/` ficaria pública.
- **Dois bugs de plataforma encontrados de passagem**: `build:static` nunca rodou no Windows (usa sintaxe POSIX de env var, que o cmd.exe não entende) e a detecção de CLI em `render-html.mjs` e `build-doc.mjs` comparava `import.meta.url` com uma string montada à mão, que no Windows nunca casa (`file:///C:/` tem três barras). O segundo foi corrigido; o primeiro **não era só do Windows** — o modo estático estava quebrado em qualquer sistema desde que o sitemap passou a ler do Supabase, e nunca rodava no deploy. Removido inteiro em 2026-07-31.

## Executado em 2026-07-30 (saneamento em produção)

Bloco 2, 3 e parte do 5 do calendário editorial, aplicados direto no ar.

- **9 páginas com meta tags reescritas** (`adhoc-fix-meta.mjs --apply`). Maiores casos: `quanto-custa-construir-...` saiu de 70 para 50 caracteres (o título de 70 era descartado pelo Google, que exibia o H1 truncado); `financiar-construcao-...` ganhou **"Caixa"** no título, entidade que o 1º colocado da SERP usa e que faltava; `fundacao-steel-frame-vs-alvenaria` ganhou **"radier"**, palavra que está na query e não estava no título; `drywall-st-ru-rf` perdeu o jargão inicial e o "2025" defasado.
- **Duas suposições do plano foram refutadas na execução**: `normas-light-steel-frame-brasil` **já tinha** NBR 16970 no título e 55 caracteres, então só a descrição mudou; e `custo-steel-frame-m2-2026` foi deliberadamente **não alterada** no título, porque tem o melhor CTR do site (2,98%) e o risco não compensa.
- **Contradição de preço resolvida sem precisar de decisão**: o corpo do artigo, os componentes JSONB e a `meta_description` já convergiam em **R$ 3.015 a R$ 6.091/m²**. Só o `answer_summary` dizia R$ 2.500-4.500, e era ele o desatualizado — junto com a simulação de 150 m², que dizia R$ 375-675 mil quando o corpo diz R$ 600-780 mil. Isso **destrava as pautas de custo de agosto**.
- **`Google-Extended` desbloqueado** em `app/robots.ts`, com o comentário corrigido. `ChatGPT-User`, `Claude-User` e `Perplexity-User` ganharam allow explícito em vez de depender do curinga. `GPTBot` e `ClaudeBot` continuam bloqueados **por escolha editorial**, que é diferente de estarem bloqueados por engano.
- **Vault sincronizado com produção**: 17 arquivos e 19 campos de `seo_title`/`seo_description`/`answer_summary` estavam divergentes do que está no ar, a maioria por deriva anterior a esta sessão. Novo script `adhoc-sync-vault-meta.mjs` faz a direção Supabase → vault, que não existia.
- **Warn antigo do vault zerado**: `2026-07-09-pdf-institucional/briefing.md` tinha `projetos_relacionados` fora da ordem canônica. Vault em **0 errors, 0 warns**.

A linha de base de CTR de cada página ficou registrada em [[2026-08-calendario-editorial]]. O cron de 01/09 mede o efeito sem intervenção.

### Pendências abertas desta sessão

- [x] ~~**Aplicar migration 008**~~ ✅ 2026-07-30 — aplicada pelo Bruno, 10 documentos semeados
- [ ] Conferir `/admin/documentacoes` logado: lista, filtro, viewer e gráficos dentro do iframe
- [x] ~~Desbloquear `Google-Extended`~~ ✅ 2026-07-30 — liberado, verificado no robots.txt de produção
- [x] ~~Corrigir a descrição do robots.txt em [[seo-aeo-strategy]]~~ ✅ 2026-07-30
- [x] ~~Publicar o OAuth consent screen~~ — feito em 2026-07-30. App em produção, refresh voltou a funcionar e token reemitido sob o novo regime. Detalhes em [[google-apis-setup]]
- [x] ~~Registrar custom dimensions no GA4~~ ✅ 2026-07-30 — `cta_location`, `channel` e `segment` criadas com escopo Evento. Falta marcar `generate_lead`/`whatsapp_click` como Evento principal, o que só é possível depois da Fase 3
- [ ] Conferir visualmente `/admin/analytics` (badge, tooltip do Comparar, ponto vazado) — não verificável sem login
- [x] ~~Resolver contradição de preço~~ ✅ 2026-07-30 — faixa canônica **R$ 3.015 a R$ 6.091/m²** (Sudeste). Só o `answer_summary` divergia
- [ ] Classificar os 6 arquivos do vault que não estão em produção (despublicados? renomeados? nunca publicados?) — ver [[blog]]
- [x] ~~Refazer metas P0/P3 de [[seo-aeo]]~~ ✅ 2026-07-30 — as antigas mediam "existir no Google", fase encerrada. As novas medem concentração, diversificação de intenção e conversão
- [ ] Fases 3-5 do plano (instrumentação de conversão, CTA no blog, IQS, diagnóstico): `~/.claude/plans/executa-o-sprint-4-whimsical-thimble.md` ⚠️ **fora do vault e fora do git** — 32KB só na máquina local. Se importar, promover para nota do vault
- [x] ~~Rodar `/wrap-up` da semana de 27-31/07~~ — janela encerrada; os fatos relevantes foram consolidados nesta sprint e nos hubs. O de 24/07 foi perdido por limite de uso e não é recuperável
- [ ] Conferir os logs de auth do Supabase por acessos não reconhecidos. A senha da conta esteve pública no bundle do admin desde que ele existe — rotacionada em 31/07, mas não há como saber se foi usada sem olhar o log
- [ ] Avaliar mudar o horário dos crons: `berkahn-wrapup-semanal` roda sexta 17h, encavalado com uso interativo. Rodar de madrugada reduz a chance de bater no limite semanal
- [ ] Considerar um passo de verificação nos crons de standup/wrap-up que confirme se o arquivo esperado existe ao final, já que uma sessão pode morrer entre a chamada e a escrita

## Wins / decisões (2026-07-01)

- **Banco de imagens consolidado + catalogado** ([[00-meta/projetos/materiais|materiais]]): 160 arquivos organizados em `Docs/banco-imagens/` (9 categorias, 11 duplicatas apagadas por sha256), catálogo reescrito (MOC [[40-content/materiais/banco-imagens|banco-imagens]] + 9 índices + 8 galerias visuais + [[banco-imagens.base]]), script `vault-images.mjs`. `public/images/` intocado. PRs #5/#6.
- **Marca d'água BERKAHN** em 26 imagens do Clube Quinta dos Lagos ([[watermark-clube-quinta-dos-lagos]]): wordmark centralizado, 15% (máx-discreto, decisão do Bruno), cor adaptativa por região; script reutilizável `watermark-images.mjs`. PRs #7/#8. Zip pronto para Drive.
- **Achado (dívida)**: arquivo `nul` (nome reservado Windows) na raiz trava `git add -A` — commits desta sessão foram por-caminho. `scripts/` é gitignored (tools ficam locais). `claude.md` tracked em minúsculo (case-mismatch resolvido).
- **Cron mensal `berkahn-performance-mensal` falhou silenciosamente**: disparou 10:23 BRT mas `test-auth.mjs` retornou `invalid_grant` (2ª ocorrência — mesma raiz do incidente Maio/2026). Recuperado manualmente: `oauth-login.mjs` → novo refresh token → `generate-report.mjs` completou → snapshot Junho/2026 no Supabase + MD/HTML em `40-content/auditorias-seo/2026-06-performance-blog.*`.
- **Hardening aplicado**: `generate-report.mjs` agora grava `~/.claude/scheduled-tasks/berkahn-performance-mensal/last-error.log` em falha e apaga em sucesso. SKILL.md do cron instrui checar esse log antes de rodar. Fim das falhas de 30 dias sem sinal.
- Reference doc atualizada: [[google-apis-setup]] tabela troubleshooting com linha nova pro `last-error.log` e diagnóstico OAuth (não JSON key).

## Decisões da semana (2026-05-22)

### Reorganização do vault (concluída)
- Aprovado plano de reorganização vault em **3 sprints + Fase 4 opcional** de integrações MCP
- Markdown em `40-content/blog/publicados/` é **source-of-truth** (sync Supabase via `/artigo`)
- Migrar TODOS markdowns de `Docs/` para vault; binaries (170 imagens + 4 PDFs) ficam em `Docs/` com notas-índice
- Ativar `/standup` (segunda 9h) e `/wrap-up` (sexta 17h) via scheduled-tasks
- KPIs **FLAT** no frontmatter (`kpi_*`), agregados por `kpis.base`
- Rename arquivos kebab-case **com PATCH Supabase atômico + 301 redirects**
- **B híbrido**: script estrutural + Claude semântico em batches (~5-10 artigos)
- **vault-validate.mjs em Node** (não bash), só manual (sem pre-commit hook)
- **Linter ordem canônica** expandida para 107 keys (Sprint 3.0)

### Triagem artigos problemáticos
- 3 artigos arquivados em `99-archive/blog-publicados-arquivados/`:
  - `tendencias-modular-2025-draft.md` (rascunho com placeholders)
  - `artigo-medstar-georgetown-v2025-superseded.md` (duplicata de hospital-em-operacao)
  - `steel-frame-revolucao-sustentavel-duplicate.md` (duplicata confirmada de futuro-construcao)

## Métricas finais (snapshot reorganização)

| Métrica | Início | Final | Δ |
|---------|--------|-------|---|
| Notas no vault | 79 | 113 | +34 |
| Hubs de projeto | 0 | 7 | +7 ✅ |
| Atomic notes (70-knowledge) | 0 | 10 | +10 ✅ |
| Índices de binaries | 0 | 9 | +9 ✅ |
| Workflows documentados | 1 | 6 | +5 ✅ |
| Bases dinâmicas | 4 | 8 | +4 ✅ |
| Markdowns migrados de Docs/ | 0 | 14 | +14 ✅ |
| Artigos com ai_summary | 0/35 | 32/32 ativos | 100% ✅ |
| Artigos com tags `domain/` | 0/35 | 32/32 | 100% ✅ |
| Artigos com wikilinks rodapé | 0/35 | 32/32 | 100% ✅ |
| Scripts vault-* em `scripts/` | 0 | 4 | +4 ✅ |
| Slash commands novos | 0 | 2 (/standup, /wrap-up) | +2 ✅ |
| Scheduled-tasks ativas | 0 | 2 (seg 9h + sex 17h) | +2 ✅ |
| Linter ordem canônica (keys) | 17 | 107 | +90 ✅ |
| Arquivos Docs/ legacy | 21 | 1 (README) | -20 ✅ |
| **Validate ERRORs/WARNs** | n/a | **0/0** | ✅ |

## Métricas operacionais (atualizar via /standup)

| Métrica | Valor atual | Meta semanal | Δ |
|---------|-------------|--------------|---|
| Artigos publicados (total) | 38 ativos + 3 arquivados | 39 (sem 30) | -1 |
| Posts LinkedIn (total) | 1 | 2 | -1 |
| Páginas indexadas Google | 34/38 (89%) | 38/38 | -4 |
| Posts sem meta tags | 9 | 5 | +4 ⚠️ |
| Posts sem answer_summary | 3 | 0 | +3 ⚠️ |

## Referências

- Plano completo Sprint 1-3 + P1 + P2: `~/.claude/plans/agora-eu-preciso-entender-functional-pinwheel.md`
- Workflow editorial: [[workflow-conteudo]]
- Pipeline blog: [[article-pipeline]]
- SEO: [[seo-aeo-strategy]]
- Dashboards: [[projetos.base]] · [[kpis.base]] · [[conhecimento.base]] · [[materiais.base]]
- Scripts vault: `scripts/VAULT-SCRIPTS-README.md`
- 7 hubs: [[blog]] · [[linkedin]] · [[site]] · [[seo-aeo]] · [[apresentacoes]] · [[00-meta/projetos/materiais|materiais]] · [[pesquisas]]
- MOC: [[MOC]]
