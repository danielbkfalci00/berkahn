---
tipo: auditoria
criado: 2026-08-07
atualizado: 2026-08-11
tags:
  - project/site
  - project/blog
  - domain/seo
  - status/active
  - source/manual
ai_summary: "Diagnóstico integrado: crawl 47/47 verde, SSG/ISR preservado e JS do artigo -41,2%. CRM Supabase 024–029 e PR #53 estão em produção; smoke público passou. Pendem smoke autenticado, Edge de retenção, Web Push opcional e CWV de campo."
status: active
projeto: seo-aeo
kpi_crawl_urls_ok: 47
kpi_crawl_urls_total: 47
kpi_js_artigo_kb: 218
kpi_js_artigo_reducao_pct: 41.2
kpi_axe_cenarios_ok: 28
kpi_axe_cenarios_total: 28
kpi_lighthouse_mobile_lcp_ok: 1
kpi_lighthouse_mobile_rotas: 8
kpi_atualizado_em: 2026-08-07
projetos_relacionados:
  - site
  - seo-aeo
  - blog
data_diagnostico: 2026-08-07
substitui: 2026-04-diagnostico-integrado
---

# Diagnóstico integrado do site — agosto de 2026

> Diagnóstico vigente para [[site]], [[seo-aeo]] e [[blog]]. Substitui [[2026-04-diagnostico-integrado]] sem apagar seu histórico. Regras permanentes continuam em [[workflow-site]], [[workflow-seo]], [[seo-aeo-strategy]] e [[google-sheets]].

## Decisão executiva

O site mantém indexabilidade, SSG/ISR e qualidade visual, mas o gargalo de laboratório ainda é LCP mobile, não CLS ou bloqueio de main thread. A primeira entrega concentrou ganhos de baixo risco: fontes por rota, shell sem Motion, formulário sob demanda, gráficos fora do caminho crítico, imagens responsivas, acessibilidade e mensuração de contato.

Não há base para afirmar ganho de conversão ou CWV de campo nesta data. Speed Insights requer sete dias de observação e o p75 de campo deve ser avaliado em 28 dias. A quebra de série do Consent Mode em 2026-07-30 impede tratar GA4 anterior e posterior como uma série equivalente.

## Escopo e método

- Base: origin/main em 86cc93f, branch codex/site-performance-audit.
- Ambiente: build de produção local, Next.js 15.5.x, porta 3113.
- Lighthouse 13.4.1, navegação com cache frio, três execuções por rota e mediana.
- Mobile: 412 × 823, DPR 1,75, RTT 150 ms, download 1.474,56 Kbps e CPU 4×.
- Desktop: 1350 × 940, DPR 1, RTT 40 ms, throughput 10.240 Kbps.
- Oito arquétipos: home, listagem, artigo líder, institucional, serviço, segmento, projeto e contato.
- Crawl: 47 URLs do sitemap, mais apresentação executiva, institucional/PDF, etapas da obra e orçamento como superfícies públicas noindex.
- Consentimento: laboratório sem envio analítico; GA4 real somente após consentimento.
- Artefatos brutos de Lighthouse, traces e screenshots ficaram em diretório temporário fora do vault e do repositório.

## Baseline de negócio e aquisição

Julho de 2026 fechado:

| Métrica | Valor |
|---|---:|
| Usuários GA4 | 1.681 |
| Sessões GA4 | 2.027 |
| Views | 2.444 |
| Taxa de engajamento | 47,1% |
| Tempo médio por sessão | 145,3 s |
| Participação mobile | 60,3% |
| Participação do blog em views | 81,5% |
| GSC cliques | 1.370 |
| GSC impressões | 42.011 |
| GSC CTR | 3,26% |
| GSC posição média | 4,5 |
| Referrals de IA observados | ChatGPT 86; Copilot 5; Claude 2 |

O artigo líder, /atualidades/custo-steel-frame-m2-2026, teve 1.314 views, 1.046 cliques e 27.078 impressões. Os únicos eventos de contato observados no período foram um cta_click e um whatsapp_click, pois a instrumentação entrou em 2026-07-30. Isso é baseline de cobertura, não taxa de conversão.

## Resultado técnico

- Build: 88 páginas.
- First Load JS: home 241 kB; /atualidades 179 kB; artigo 218 kB contra 371 kB, redução de 41,2%.
- /atualidades e artigos continuam prerenderizados com ISR de 60 s; slug inexistente continua 404.
- Crawl 47/47: status 200, title, description, um H1 e canonical; nenhuma URL do sitemap recebeu noindex.
- Superfícies comerciais noindex: 4/4 com status 200, um H1 e noindex.
- Axe: 28/28 cenários sem violação séria ou crítica, cobrindo 390 e 1440 px com reduced-motion.
- Imagens fill sem sizes: zero. Masters não foram alterados nem removidos.
- Gráficos continuam legíveis no HTML sem JavaScript por tabelas semânticas e carregam Recharts perto do viewport.
- Revisões TypeScript, design e segurança foram executadas; os achados materiais foram corrigidos.

## Lighthouse — mediana de três execuções

| Dispositivo | Arquétipo | Perf | LCP ms | CLS | TBT ms |
|---|---|---:|---:|---:|---:|
| mobile | home | 76 | 5.141 | 0,001 | 158 |
| mobile | listagem | 81 | 4.277 | 0 | 192 |
| mobile | artigo | 81 | 4.223 | 0,002 | 200 |
| mobile | institucional | 95 | 2.791 | 0,009 | 79 |
| mobile | serviço | 92 | 3.169 | 0 | 128 |
| mobile | segmento | 73 | 6.430 | 0,054 | 124 |
| mobile | projeto | 94 | 3.014 | 0 | 53 |
| mobile | contato | 94 | 2.439 | 0,001 | 178 |
| desktop | home | 99 | 880 | 0,001 | 0 |
| desktop | listagem | 100 | 803 | 0,023 | 4 |
| desktop | artigo | 100 | 772 | 0,001 | 10 |
| desktop | institucional | 100 | 706 | 0 | 4 |
| desktop | serviço | 100 | 721 | 0 | 0 |
| desktop | segmento | 97 | 1.221 | 0 | 0 |
| desktop | projeto | 100 | 758 | 0 | 0 |
| desktop | contato | 100 | 599 | 0 | 0 |

TBT mobile ficou em até 200 ms e CLS em até 0,054. LCP mobile atingiu 2,5 s apenas em contato; 7/8 arquétipos ainda exigem investigação e validação de campo. Desktop ficou entre 97 e 100. No artigo, o TBT medido antes da postergação de gráficos estava entre 1.663 e 2.073 ms; a mediana final foi 200 ms.

## Alterações entregues

### Critical path e mídia

- Manrope permanece global; Archivo e Space Mono são escopadas à home e /atualidades; Playfair e Caveat ao orçamento.
- Sidebar, banner de cookies e botão de WhatsApp deixaram de hidratar Motion no shell.
- O formulário compartilhado é carregado quando o diálogo abre, sem alterar seu uso direto em /contato.
- Renderizadores legado e Supabase foram separados; charts e matriz 3D carregam sob demanda.
- sizes foi corrigido nos contextos de projeto, artigo, galeria e orçamento.
- O slider residencial deixou de antecipar originais brutos e passou a pré-carregar variantes responsivas após load. A primeira imagem não começa transparente.
- Três MP4s sem referência não foram removidos: há cópias apenas em worktrees, não um master independente comprovado.

### Conversão e dados

Eventos padronizados e preservados:

- cta_click: abertura ou clique em CTA.
- form_submit: tentativa concluída de formulário.
- generate_lead: contato recebido com sucesso.
- whatsapp_click: intenção de contato, nunca lead confirmado.

As propriedades comuns são page_path, cta_location, channel e segment quando aplicável. O WhatsApp direto de /contato e demais CTAs Berkahn agora entram nessa cobertura. Nenhuma PII é enviada ao GA4.

Supabase é a única custódia operacional de leads e PII. Google Sheets e Apps Script foram retirados do caminho em 11/08; a rota responde após o insert e tenta apenas Web Push opcional, sem PII.

### Extensão do diagnóstico — CRM Supabase (2026-08-10)

As migrations 024–029 foram aplicadas em produção. O banco possui funil completo, atribuição consentida, visualização, próxima ação, arquivamento, vínculos comerciais, importação idempotente, responsáveis, prioridade, último status, arquivos e outbox push. RPCs tornam funil, operação e remoção de anexos atômicos; RLS exige o administrador canônico também em logs e entidades comerciais. A matriz anon / authenticated não autorizado / admin / service role, a reversão quando o log falha, a fila de Storage e o payload push sem PII passaram em transação revertida.

`/admin/leads` foi separado de Analytics com Inbox paginada, Kanban, filtros, KPIs de 28 dias, detalhe, timeline, último status, responsável, prioridade, retry e cadastro manual com alerta de duplicidade. Uploads até 6 MB usam Storage privado e arquivos grandes/pastas usam vínculo do Drive. A PWA não cacheia telas e o push mostra somente mensagens operacionais genéricas. Orçamento reutiliza o wizard atual com `lead_id`; propostas recebem apenas a FK preparatória. O build de produção preserva SSG/ISR público.

A conta Supabase CLI disponível devolveu 403 ao publicar Edge Functions e a sessão Vercel não expôs as variáveis do escopo Berkahn. Portanto, retenção e push não foram agendados e chaves VAPID não foram gravadas. Apps Script e importação da planilha deixaram de fazer parte do rollout. A UI trata push como opcional, sem oferecer um botão quebrado. Fontes canônicas: [[admin-setup]], [[google-sheets]] e [[site]].

## SEO e AEO

O crawl não encontrou regressão de status, canonical, headings, metadata, sitemap ou indexabilidade. Nenhum title, description ou artigo líder foi reescrito sem evidência. A política de bots segue permitindo busca por IA e bloqueando treinamento conforme [[seo-aeo-strategy]].

Baseline de 15 consultas prioritárias:

| Plataforma | Cobertura | Presença Berkahn | Limite |
|---|---:|---:|---|
| Busca Google/web | 15/15 | 12/15 | Gaps principais: vale a pena, fundação e durabilidade como intenção primária |
| Perplexity | 15/15 | 2/15 | Presença em custo e isolamento acústico |
| ChatGPT anônimo | 13/15 | 5/13 | Duas consultas indisponíveis por travamento; presença em custo, preço, financiamento, normas e fundação |
| Claude | 0/15 | indisponível | A sessão pública redirecionou para login; não foi inferida ausência |

A amostra muda com data, localização e modelo. Sentimento e concorrentes não foram pontuados quando a fonte não ofereceu resposta estável e comparável. O principal achado é a diferença entre forte descoberta em busca aberta e citação ainda baixa nas respostas generativas. Não há justificativa para llms.txt, markup especial ou fragmentação artificial de conteúdo.

## Gates e riscos residuais

Concluídos:

- lint, typecheck e build verdes; lint conserva quatro warnings preexistentes sem erro.
- Crawl, ISR/404, noindex, teclado, reduced-motion e axe verdes.
- Masters de mídia intactos e nenhum artefato bruto versionado.
- Smoke HTTP local: home, listagem, artigo líder e contato 200; slug falso 404.

### Rollout remoto verificado

- PR #53 foi mergeado em `main` no commit `5121941`; Quality e os deploys `berkahn` + `berkahn-admin` concluíram com sucesso em 11/08.
- Smoke público confirmou site 200, política Supabase-only e redirecionamento do admin sem sessão para `/admin/login`.
- A Google Analytics Admin API foi ativada; OAuth com `analytics.edit` registrou `article_slug` e `percent_scrolled` na propriedade 516973519.
- A sessão CLI ainda não acessa o escopo Vercel `daniel-falcis-projects`; isso não bloqueou o deploy, mas impede configurar o Web Push opcional.
- O smoke autenticado continua pendente porque nenhum harness com credenciais é versionado.

Pendências externas:
- [ ] @bruno Definir generate_lead e whatsapp_click como Key Events no GA4 e validar em DebugView/Realtime após consentimento #pendencia
- [x] Remover Apps Script/Sheets do caminho operacional
- [ ] @bruno Dar acesso ao escopo Vercel `daniel-falcis-projects`; configurar VAPID e o segredo do dispatcher nos projetos site/admin #pendencia
- [x] Importação/reconciliação da planilha retirada do rollout pela decisão Supabase-only; higiene de PII histórica permanece opcional em [[google-sheets]]
- [ ] @bruno Liberar acesso Supabase Functions para publicar/agendar a retenção mensal #pendencia
- [ ] @bruno Monitorar Speed Insights por sete dias e consolidar p75 de campo em 28 dias sem misturar a série pré e pós-Consent Mode #pendencia
- [ ] @bruno Repetir as 15 consultas no Claude autenticado e completar as duas consultas instáveis do ChatGPT #pendencia
- [ ] @bruno Realizar cinco testes de tarefa antes de qualquer A/B test ou decisão definitiva de CRO #pendencia

## Próximo corte de priorização

1. Fechar merge/deploy do CRM e o rollout opcional de Web Push.
2. Observar Speed Insights por sete dias; separar LCP por rota e elemento.
3. Atacar LCP mobile de segmento, home e listagem com evidência de waterfall, sem reduzir a qualidade dos masters.
4. Após 28 dias ou volume suficiente, avaliar taxa de contatos recebidos e qualificados.
5. Só então abrir a trilha separada do admin.

<!-- vault-rodape-v1 -->
> [!info] Contexto
> Projeto principal: [[seo-aeo]] · Relacionados: [[site]], [[blog]] · Workflows: [[workflow-seo]], [[workflow-site]]
