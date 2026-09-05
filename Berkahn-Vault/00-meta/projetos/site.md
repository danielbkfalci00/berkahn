---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-09-05
tags:
  - project/site
  - status/active
ai_summary: "Hub do Site — Admin tem contas individuais, quatro papéis, PWA/push por usuário e analytics mensal hospedado. O clone do GitHub Pages foi neutralizado; pendem smoke multidispositivo e o encerramento administrativo do host legado."
status: active
projeto: site
kpi_paginas_indexadas: 34
kpi_paginas_total: 38
kpi_lcp_target_ms: 2500
kpi_inp_target_ms: 200
kpi_cls_target: 0.1
kpi_isr_revalidate_s: 60
kpi_componentes_article: 19
kpi_atualizado_em: 2026-08-07
contextos_aplicados:
  - stack-nextjs-supabase
  - admin-setup
  - design-principles
  - home-redesign-direcao
  - seo-aeo-strategy
  - google-sheets
workflow: workflow-site
prompts_relacionados: []
bases_relacionadas:
  - kpis
subagents_uteis:
  - pragmatic-code-review
  - design-review
  - security-review
code_paths:
  - app/
  - components/
  - lib/
  - public/
  - scripts/
---

# Site — Projeto

> Hub do projeto Site (next-app + admin). Em produção em [berkahn.com.br](https://www.berkahn.com.br). Ajustes contínuos.

## Status atual

Site em produção (Next.js 16 App Router + Supabase + Vercel + Tailwind + shadcn/ui). O CRM leve em `/admin/leads` foi mergeado pela PR #53 no commit `5121941` e está deployado nos projetos `berkahn` e `berkahn-admin`; arquitetura e runbook vivem em [[admin-setup]]. Supabase é a única fonte operacional; Google Sheets e Apps Script são legado desativado em [[google-sheets]].

**Diagnóstico integrado 2026-08-07**: o crawl agora cobre as 47 URLs do sitemap e superfícies públicas `noindex`; o artigo caiu de 371 para 218 kB de First Load JS (-41,2%), com home em 241 kB e `/atualidades` em 179 kB. SSG/ISR de 60 s e 404 foram preservados. Evidências, limites de laboratório e baseline de conversão vivem em [[2026-08-diagnostico-integrado-site]].

## Bloqueios ativos

- [x] ~~**PR #17 (institucional v3) pendente merge**~~ — mergeado em 2026-07-30, junto com #15 e #16. **O que sobrou**: validar `/institucional/pdf` em produção, atualizar o briefing para v4 e distribuir o PDF (ver "Próximos 7 dias")
- [x] **Indexação Google** (delegado a [[seo-aeo]]): resolvido em 2026-07-29 — 34/38 artigos (89%), contra 6/44 em abril
- [x] ~~**Bug SearchAction**~~ — resolvido em 2026-07-30 **removendo** o bloco. Não era URL inválida: o `urlTemplate` apontava para `/perguntas-frequentes?q=`, e aquela página ignora o parâmetro (o componente não recebe props) e devolve a FAQ inteira. Como o sitelinks searchbox foi descontinuado pelo Google em nov/2024, declarar a busca não tinha contrapartida
- [x] ~~**Quatro CTAs apontando para `/contato`, que respondia 404**~~ — resolvido em 2026-07-30. `app/portfolio/page.tsx:153`, `ProjectModels.tsx:180`, `ProjectSpecs.tsx:72` e `ProjectsGrid.tsx:41` linkavam para uma rota que **nunca existiu**: a captura de lead só existia como modal. O `ContactForm` foi extraído do `ContactFormDialog` e agora serve os dois — o modal e a página `/contato`, indexável e linkável. Fecha o item 7 do diagnóstico ("não existe caminho público para pedir orçamento")
- [x] ~~**Senha da conta Supabase no bundle público do admin**~~ — resolvido em 2026-07-31 (#42). `LoginForm.tsx` era Client Component e a constante `ACCESS_CODE` era, na verdade, a senha passada para `signInWithPassword`. Autenticação movida para Server Action; não há mais segredo no repositório nem no ambiente. Senha rotacionada. Detalhes e o que ainda cabe fazer em [[supabase-config]] (Histórico de incidentes)
- [x] ~~**Seis rotas `/api/admin/*` sem autenticação**~~ — resolvido em 2026-08-05. O matcher do middleware era `['/', '/admin/:path*']` e não cobria `/api/admin/*`; três das rotas usavam `createServiceClient()`, que bypassa RLS. Sem login dava para listar todos os orçamentos com dado pessoal do cliente, apagar por id, e pegar signed URL do PDF. Fechado com matcher + `exigirSessao()` nos 10 handlers. Verificado: as 9 combinações devolvem 401
- [x] ~~**Dupla escrita dos comandos de conteúdo**~~ — resolvido em 2026-08-06. `/pesquisa` e `/linkedin` gravam na pauta via `scripts/conteudo/pauta.mjs` e não criam mais `.md` no vault. `/criacao` e `/calendario` foram corrigidos junto: um procurava a pesquisa na pasta que deixou de ser alimentada, o outro contava posts pendentes varrendo uma pasta congelada. Ver [[quadro-conteudo]]
- [x] ~~**CTA sumia do DOM em dev**~~ — resolvido em 2026-08-18 (PR #60). `components/sections/CTA.tsx` era Server Component e o botão ia como `children` para o `DialogTrigger asChild` do Radix; o filho chegava pelo payload RSC e a hidratação falhava, regenerando a árvore, sumindo com o botão e reinserindo o `<script>` do layout no `<head>`. Marcado como Client Component. **Só reproduzia em dev**, o build de produção não pegava, então o sintoma passou meses sem diagnóstico. O casamento React 18.3.1 com Next 16.3 continua valendo uma revisão à parte
- [x] ~~**Hero do artigo estourava a seção no celular**~~ — resolvido em 2026-08-27 (PR #71). Reportado com print. Medido em produção a 375×812, o bloco de conteúdo do hero tinha 484px dentro de uma seção de 406px e começava **78px acima** do topo dela, então a pílula de categoria e parte do título ficavam fora da imagem. Três causas somadas: `h-[50vh] min-h-[400px]` era altura fixa e não crescia com o conteúdo; o excerpt era `text-lg` sem degrau para mobile, 224px em oito linhas; e o gradiente terminava em `to-transparent` justamente no topo, onde o texto transbordado ia parar. **13 dos 42 posts publicados estouravam** e os demais ficavam a 6px da borda, o que descartou corrigir excerpt por excerpt. A seção passou a `min-h-[max(50vh,400px)]`, o gradiente a `to-black/30`, título e excerpt ganharam degrau e o excerpt fica em quatro linhas só até `sm`. Verificado em 320, 375, 768 e 1440. `ArticleContent.tsx` tem o mesmo defeito latente e ficou de fora porque o Supabase responde antes para todos os 42 slugs, então aquele caminho é inalcançável hoje
- [x] ~~**Modal de contato sem nome acessível**~~ — resolvido em 2026-08-25 (PR #62). O `DialogContent` disparava em produção o aviso do Radix pedindo `DialogTitle`. Duas causas somadas: `ContactForm` é `next/dynamic`, então durante o carregamento do chunk o título ainda não existe no DOM, que é exatamente quando o foco entra no diálogo; e o `{header}` só renderiza no ramo do formulário, então **depois do envio o título desmontava** e o diálogo ficava sem nome pelo resto da sessão. `DialogTitle` e `DialogDescription` passaram a filhos diretos do content dentro de `VisuallyHidden`, com o cabeçalho visível seguindo no formulário. Verificado em produção
- [x] **Contas Supabase por pessoa**: migration 031 aplicada em 2026-08-27; `lead_responsaveis` virou cadastro de membros vinculado a `auth.users`, com convite, senha individual e papéis `owner`, `comercial`, `conteudo` e `viewer`. Comentários agora resolvem a autoria pela sessão no servidor. Matriz e operação em [[admin-setup]] e [[comentarios-inline-documentacoes]].
- [x] **Banco do CRM aplicado**: migrations 024–029 em produção; funil, RPCs, vínculos, RLS canônica, responsáveis, prioridade, resumo operacional, arquivos, remoção atômica, outbox push, `pg_cron` e `pg_net` instalados. Matriz RLS, rollback atômico, cleanup de arquivos e payload push sem PII verdes
- [x] **Importação histórica concluída**: 29 linhas do CSV legado estão no Supabase, todas ativas em `novo` e nenhuma arquivada. O identificador `origem_legado` mantém reexecução idempotente; procedimento em [[admin-setup#CRM de leads]].
- [x] **Retenção operacional**: `lead-retention` v1 publicada, segredos sincronizados no Edge/Vault e job mensal ativo desde 2026-08-14; rollout sem candidatos ou objetos pendentes
- [x] **Web Push configurado**: VAPID + `LEAD_PUSH_CRON_SECRET` nos projetos site/admin, segredo homônimo no Vault e dispatcher agendado a cada 15 minutos desde 2026-08-14
- [x] **Analytics mensal hospedado**: workflow GitHub Actions no dia 4 reutiliza o pipeline GA4/GSC e elimina dependência do computador local. Validado em 2026-08-27 com Julho/2026: run verde e snapshot persistido no Supabase às 14:42 BRT. A primeira tentativa revelou que a anon key já armazenada não estava exposta ao job; corrigido pela PR #70. Operação e segredos em [[admin-setup]].
- [x] **GA4 Admin concluído**: OAuth de edição validado; `article_slug` e `percent_scrolled` registrados em 10/08
- [x] **Apps Script encerrado**: nenhuma captura ou notificação depende de Google Sheets; Web Push é o canal opcional do admin
- **Core Web Vitals de campo**: otimizações estruturais entregues em [[2026-08-diagnostico-integrado-site]]; a tarefa de medição vive em “Próximos 7 dias”.

## Próximos 7 dias

- [x] ~~**Home redesign — fechar o PR #43**~~ — mergeado em 2026-08-06 com hub reconciliado; `@design-review` executado e follow-up PR #44 mergeado
- [x] ~~**Trocar take e restaurar copy institucional da home**~~ — 1080p integral convertido em 72/36 frames; copy conferida contra `bc6515f`; rail de projetos preservado no código e desmontado da composição
- [ ] @bruno Medir CWV no Speed Insights por 7 dias e consolidar em 28 dias, sem misturar as séries anterior e posterior ao Consent Mode de 2026-07-30; baseline em [[2026-08-diagnostico-integrado-site]] #pendencia
- [ ] @bruno Executar smoke multidispositivo com uma segunda conta convidada: login, restrição por papel, Inbox, Kanban, upload, instalação PWA e recebimento Web Push conforme [[admin-setup]] #pendencia
- [ ] @bruno Desativar definitivamente o GitHub Pages em `Settings → Pages` quando houver conta proprietária/admin; o risco SEO e a exposição já foram neutralizados pela PR #72, restando eliminar builds desnecessários #pendencia

> [!success] Conteúdo duplicado do Pages neutralizado em 2026-08-27
> A PR #72 removeu o gitlink órfão `claude-code-workflows`, que fazia todo
> `pages-build-deployment` falhar, e substituiu o export antigo por duas páginas
> estáticas com `noindex,nofollow,noarchive`, canonical e redirecionamento para
> `berkahn.com.br`. O primeiro build passou (`33104672960`) e a API mudou de
> `errored` para `built`. Smoke pós-deploy: home 200 com 950 bytes; `package.json`,
> `Berkahn-Vault/index.md` e uma rota de artigo retornam 404 sem expor o monorepo.
>
> O host ainda está tecnicamente ativo porque a conta CLI tem `push`, mas não
> `admin`. Isso deixou de ser bloqueio de SEO e virou higiene administrativa.
> O `_config.yml` usa uma **denylist fail-open**, não uma allowlist: todo novo
> item rastreado na raiz precisa ser excluído explicitamente ou será publicado.
- [x] **Upgrade breaking de dependências concluído em 12/08**: Next 16.3, Sharp 0.35.3, Puppeteer 25.6, ESLint flat e D3 corrigido; `npm audit` retorna zero. Fontes locais retiraram a dependência de Google Fonts no CI. Detalhe em [[stack-nextjs-supabase]]
- [x] ~~**Próxima página do redesign: `/atualidades`**~~ — concluída em 2026-08-06: abertura fundida, bento, categorias canônicas, payload 141/26 KB e ISR 60 preservado
- [ ] @bruno Importar Clube Quinta dos Lagos para o banco de imagens antes de reativar o rail de projetos #pendencia
- [ ] @bruno Validar `/institucional/pdf` gerando PDF em produção após o merge da PR #17 #pendencia
- [ ] @bruno Atualizar o briefing do institucional para v4 antes de distribuir; o código está em v4 e a documentação em v3 #pendencia
- [ ] @codex Mover Playfair e Caveat do layout raiz para a rota de orçamento, os únicos consumidores, e medir a redução no payload global #pendencia
- [ ] @codex Avaliar lazy-load das seções GSAP abaixo da dobra da home, preservando Lenis, acessibilidade e a narrativa visual #pendencia
- [ ] @codex Alinhar os números sem fonte que a seção 05 da home passou a contradizer, usando `SOURCES` de `lib/impact-data.ts` como registro único: `ESGBentoGrid` (>99% água, 40% climatização), `InfograficoLSF` (90% água, 3% desperdício), `lib/lsf-data.ts` (linha de água sem fonte; R da alvenaria divergente do blog; concreto na fundação 60% vs 8%), `global-steel-frame-data.ts`, `residencial-data.ts` e `data/articles/*` #pendencia
- [ ] @bruno Fechar um único valor de consumo de água por m² para o site inteiro, com fonte primária; hoje 60%, 70%, 90%, 99% e >99% coexistem, e por isso água ficou fora da seção 05 #pendencia
- [ ] @codex Conferir no texto integral de Abouhamad & Abu-Hamd (2020, DOI 10.3390/su122410686) o "180,41 kgCO₂e/m²" citado nos dois artigos de sustentabilidade; o abstract só traz percentuais, e a home usou o fallback de 1,5 t de CO₂ por tonelada de aço reciclado #pendencia
- [ ] @bruno **Casa Santa Cristina não é obra Berkahn** (dito em 2026-09-02 ao tirar a foto da seção 05). Revisar como ela aparece em `/portfolio`, `lib/residencial-data.ts:159-160`, `lib/presentation-data.ts:14-20` e na apresentação executiva; se for projeto de terceiro, precisa de crédito ou sair #pendencia
- [ ] @bruno Gerar a placa definitiva da seção 05 com o prompt registrado em [[home-redesign-direcao]] e salvar em `public/images/Home/impacto-plate.webp`; hoje a placa reaproveita a foto da fase 03 do processo #pendencia
- [ ] @bruno Levantar o desvio médio entre orçamento e valor entregue nos contratos concluídos; seria o número mais forte para "quem paga a obra" na seção 05 #pendencia
- [ ] @bruno **O argumento de carbono do Light Steel Frame não se sustenta.** O único ACV brasileiro revisado por pares de berço ao túmulo (Caldas et al., *Ambiente Construído*, 2017) conclui a favor da alvenaria, porque a operação pesa de 50% a 70% do total. Decidir o que fazer com as afirmações de carbono já publicadas em `data/articles/sustentabilidade-steel-frame.ts` ("7× menos CO₂", 15,39 vs 108,12 kg/m²), nos dois artigos de sustentabilidade do blog (180,41 kgCO₂e/m²) e em `40-content/apresentacoes/steel-frame-no-mundo.md` (119-142, faixa que se sobrepõe à do concreto). A página /sustentabilidade já trata isso de frente na seção 07; o resto do site ainda não #pendencia
- [ ] @bruno Trocar as oito fotos provisórias do Unsplash em `lib/sustentabilidade-data.ts` por fotografia nossa ou gerada com o banco de prompts de obra; os slots são floresta de abertura, cimento, areia, rio seco, fôrma de madeira, entulho, sucata e o plano de mata secundário #pendencia
- [ ] @bruno Pedir ao fornecedor de OSB o número do certificado florestal (FSC ou CERFLOR). Hoje a página só pode dizer "pinus de floresta plantada", que é declaração de fabricante; com o certificado em mãos, o texto da seção 03 e da 07 pode nomear o selo #pendencia
- [ ] @codex Medir CWV da /sustentabilidade depois do deploy. São oito fotos do Unsplash servidas pelo otimizador, uma cena 3D de seis camadas e um track horizontal; o teto combinado de peso é 1,6 MB e a página fala de baixo impacto, então peso alto ali é contradição visível #pendencia
- [ ] @codex Confirmar o volume de resíduo de construção coletado no Brasil abrindo o PDF do Panorama ABREMA à mão. A própria página da entidade publica "45 mil toneladas" onde deveria ser "45 milhões", e o número de 48 milhões que o blog usa é de 2021 #pendencia
- [ ] @bruno Achar a referência primária do par de desperdício ("< 5%" contra "até 30%"). `SOURCES.sinduscon` em `lib/impact-data.ts:82-86` é a única fonte do registro **sem `url` e sem `year`**, e é justamente a que sustenta o número mais citado do site: ele aparece na seção 05 da home e na seção 05 de /sustentabilidade. Um engenheiro que perguntar "onde está esse estudo do SINDUSCON-SP" hoje não recebe nada #pendencia
- [x] Validar build (`npm run build`) sem warnings — passou em 2026-08-12 com Next 16.3; três `<img>` migrados, Browserslist atualizado, `middleware` migrado para `proxy` e tracing integral do harness removido
- [x] **gitleaks pre-commit ativo** — reverificado em 2026-08-27 nos commits das PRs #72 e #73; o hook escaneou apenas o staged e encontrou zero leaks antes de liberar cada commit

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Artigos indexados | 34/38 (89%) | 38 | -4 |
| Páginas institucionais indexadas | não medido | — | ampliar escopo do `/performance` |
| LCP `/atualidades` produção (sintético) | 3,04–3,54 s | < 2,5 s | validar Speed Insights |
| CLS `/atualidades` local | 0 | < 0,1 | ✅ |
| ISR revalidate | 60s | 60s | OK |

## Contexto aplicado

- [[stack-nextjs-supabase]] — arquitetura geral (Next.js 16 + Supabase + RLS + Vercel)
- [[admin-setup]] — painel admin, autenticação, schema `posts`
- [[comentarios-inline-documentacoes]] — comentários inline em `/admin/documentacoes`: ponte com o iframe, ancoragem por texto e a restrição de minificação
- [[quadro-conteudo]] — quadro de pautas em `/admin/conteudo`: por que a pauta é entidade separada de `posts`, por que o quadro nunca escreve `posts.status`, e por que toda mutação confere a linha afetada (a RLS não devolve erro, devolve zero linhas)
- [[design-principles]] — paleta preto/off-white, Manrope, ícones outline
- [[home-redesign-direcao]] — direção "luxo de engenharia" da home: paleta mono estrita, Archivo/Space Mono, hero com scrub por canvas, pipeline de troca de take e banco de prompts steel-frame
- [[seo-aeo-strategy]] — regras técnicas SEO (schema, meta, robots)
- [[google-sheets]] — histórico da integração desativada

## Workflow & prompts

- Workflow: [[workflow-site]] — manutenção, novas páginas, refactors, bugs (criado em Sprint 1.8)
- Prompts: (nenhum específico ainda; usar `/seo` para auditoria)

## Bases relacionadas

- [[kpis.base]] — agrega `kpi_*` do site + outros projetos

## Subagents úteis

- `@pragmatic-code-review` — review de PRs (arquitetura, segurança, qualidade)
- `@design-review` — UI/UX changes (testes Playwright em live env)
- `@security-review` — antes de mexer em auth/payments/data handling

## Code paths (mapeamento com `60-arquitetura/`)

| Path | Conteúdo | Doc vault |
|------|----------|-----------|
| `app/` | 16 rotas Next.js App Router | [[stack-nextjs-supabase]] |
| `components/article/` | 19 componentes interativos | [[article-pipeline]] |
| `components/presentation/` | Slides + UI da /apresentacao-executiva | [[presentation-system]] |
| `lib/documentacoes/` | Ancoragem, ponte e queries dos comentários inline | [[comentarios-inline-documentacoes]] |
| `lib/` | Utilitários (Supabase client, helpers) | [[stack-nextjs-supabase]] |
| `public/images/img_blog/` | Capas WebP por artigo | — |
| `scripts/conteudo/pauta.mjs` | CLI genérico versionado do pipeline | [[quadro-conteudo]] |

## Materiais de apoio

- ~~`indices-mockups-remodelacao`~~ — a nota e a pasta `Docs/REMODELAÇÃO/` não existem mais (link órfão desde a consolidação do banco de imagens). Mockups vivos: [[40-content/materiais/banco-imagens|banco-imagens]]
- [[paginas-conteudo-v2]] — estratégia de páginas (migrado de Docs/)

## Histórico recente

- 2026-08-07: sprint integrado de performance/UX/SEO/AEO — fontes escopadas por rota, shell sem Motion, formulário lazy, charts sob demanda, sizes corrigidos, tracking de WhatsApp padronizado e axe sério/crítico zerado em 28 cenários. Ver [[2026-08-diagnostico-integrado-site]]

- 2026-08-06: home atualizada com take integral 1080p (72/36 WebPs), preload reduzido a seis frames, copy institucional restaurada de `bc6515f`, quatro fases canônicas e `ProjectsRail` temporariamente desmontado sem afetar `/portfolio`; `@design-review` fechou sobreposição do CTA com consentimento e reduced-motion dos parceiros
- 2026-08-06: PRs #43/#44 mergeados; `/atualidades` redesenhada na linguagem [[home-redesign-direcao]], migration 012 aplicada (40 posts, cinco categorias, featured único), payload ~83% menor bruto, analytics condicionado ao consentimento e SSG/ISR preservado

- 2026-07-20: standup — infra nova do **Documento Institucional PDF**: rota `app/institucional/pdf/`, `GET /api/institucional/pdf`, `components/institucional/pdf/*.tsx` (9 páginas), copy em `lib/institucional-data.ts` (2026-07-09/10). Branch `design/institucional-monografia` → PR #17 pendente merge. Reusa pipeline Puppeteer + `optImg()` (PDF 31MB → 6.7MB).
- 2026-05-22: hub criado
- 2026-05-21: vault migrado, integração documentada em `60-arquitetura/`
