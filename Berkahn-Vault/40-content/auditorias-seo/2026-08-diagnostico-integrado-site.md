---
tipo: auditoria
criado: 2026-08-07
atualizado: 2026-08-07
tags:
  - project/site
  - project/blog
  - domain/seo
  - status/active
  - source/manual
ai_summary: "Diagnóstico integrado 2026-08-07: crawl 47/47 verde, SSG/ISR preservado, JS do artigo -41,2%, axe sério/crítico zerado em 28 cenários e telemetria de contato normalizada. Mobile segue limitado por LCP em 7/8 arquétipos; campo e qualificação exigem janelas de 7/28 dias."
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

Supabase continua sendo a fonte primária de leads; a planilha é espelho retryável. Apps Script 1.2 exige segredo compartilhado, escapa HTML da notificação e remove quebras do assunto. O rate limit permanece best-effort e não atômico, aceitável no volume atual.

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

- lint, typecheck e build verdes; lint conserva sete warnings preexistentes sem erro.
- Crawl, ISR/404, noindex, teclado, reduced-motion e axe verdes.
- Masters de mídia intactos e nenhum artefato bruto versionado.
- Smoke HTTP local: home, listagem, artigo líder e contato 200; slug falso 404.

### Rollout remoto verificado

- PR #52 criado e sincronizado com a main; Quality, Vercel berkahn e Vercel berkahn-admin passaram.
- Preview do admin respondeu 200 em /admin/login.
- Preview público do site está protegido por Vercel SSO; o smoke de rotas públicas foi concluído no build de produção local.
- A CLI está autenticada no escopo brunofalci00s-projects, que não lista os projetos Berkahn da equipe daniel-falcis-projects. Sem esse acesso não é possível configurar o segredo antes do merge.
- A Google Analytics Admin API está desabilitada no projeto 428077950039; a service account existente recebeu permission denied ao tentar habilitá-la.
- Produção permanece em origin/main: o PR não foi mergeado para evitar uma pausa do espelho Google Sheets antes do rollout Apps Script-first.

Pendências externas:
- [ ] @bruno Definir generate_lead e whatsapp_click como Key Events no GA4 e validar em DebugView/Realtime após consentimento #pendencia
- [ ] @bruno Criar o mesmo segredo em GOOGLE_SHEETS_LEAD_SECRET na Vercel e LEAD_SYNC_SECRET nas Script Properties, depois publicar o Apps Script 1.2 #pendencia
- [ ] @bruno Confirmar as colunas opcionais de atribuição e qualificação na planilha real após o redeploy #pendencia
- [ ] @bruno Monitorar Speed Insights por sete dias e consolidar p75 de campo em 28 dias sem misturar a série pré e pós-Consent Mode #pendencia
- [ ] @bruno Repetir as 15 consultas no Claude autenticado e completar as duas consultas instáveis do ChatGPT #pendencia
- [ ] @bruno Realizar cinco testes de tarefa antes de qualquer A/B test ou decisão definitiva de CRO #pendencia

## Próximo corte de priorização

1. Fechar o rollout externo de mensuração e Apps Script.
2. Observar Speed Insights por sete dias; separar LCP por rota e elemento.
3. Atacar LCP mobile de segmento, home e listagem com evidência de waterfall, sem reduzir a qualidade dos masters.
4. Após 28 dias ou volume suficiente, avaliar taxa de contatos recebidos e qualificados.
5. Só então abrir a trilha separada do admin.

<!-- vault-rodape-v1 -->
> [!info] Contexto
> Projeto principal: [[seo-aeo]] · Relacionados: [[site]], [[blog]] · Workflows: [[workflow-seo]], [[workflow-site]]