---
tipo: context
criado: 2025-12-01
atualizado: 2026-09-29
tags:
  - ai/context
  - project/site
  - domain/admin
ai_summary: Sistema Admin Berkahn com contas individuais, quatro papéis, CRM em /admin/leads e PWA/Web Push por usuário e dispositivo. Migrations 024–034 (LGPD em 032, busca trigram em 033, mural de feedback em 034), retenção e dispatcher estão ativos; analytics mensal roda hospedado no GitHub Actions. Melhorias de 29/09 conciliadas com main no PR #118; migração 20260929141528 aplicada no serviço hospedado, deploy em validação.
status: active
projeto: site
escopo: berkahn
---

# Sistema Admin Berkahn

## Melhoria integral do ADMIN (29/09/2026)

Escopo autorizado: implementar a auditoria do repositório em ciclos de correção e validação. Fonte de continuidade: esta nota, vinculada a [[site]] e [[quadro-conteudo]]. As alterações editoriais locais que já existiam no início devem ser preservadas.

Critérios de aceite no repositório (a ativação hospedada é separada):
- [x] Editorial: revisão publicada em staging, data preservada, autosave sequencial com conflito explícito, preview seguro e saída protegida.
- [x] CRM: papéis consistentes, WhatsApp internacional, atendimento com próximo passo, timeline legível, fila por pendência, correção de contato e retry idempotente.
- [x] Orçamentos: vínculo ao lead, PDF renovável/versionado, dirty state correto e paginação.
- [x] Analytics: períodos comparáveis, denominador correto, falha diferente de zero, aprovação das recomendações, séries recortadas e insights fundamentados.
- [x] Interface: atalhos por papel, menu/foco acessíveis, estados vazios úteis e retirada de CTAs sem destino.
- [x] Carregamento: projeções/paginação, painéis sob demanda e isolamento dos componentes públicos.
- [x] Banco: migration aditiva para os contratos novos, guardas de papel e agregados corretos, sem apagar acervo.
- [x] Verificação: testes de regressão, lint, typecheck e build serializados; registrar limites reais de SQL/produção.

Aplicação e deploy autorizados em 29/09. A migration hospedada foi aplicada em 29/09/2026 às 13h11 BRT, após dry-run com ROLLBACK e testes transacionais; o deploy está em validação no PR118. Não iniciar Docker/WSL, Supabase local, n8n nem servidores persistentes. O smoke visual autenticado continua separado da evidência estática e dos testes locais.


### Entrega no repositório

- **Editorial:** `app/admin/posts/actions.ts:10`, `components/admin/posts/PostEditor.tsx:64` e a migration separam revisão de conteúdo live. Salvar cria/atualiza o payload da pauta com comparação de versões; publicar exige um clique explícito e preserva a data original. Publicação pelo ADMIN registra `sync_vault_pendente`: a cópia editorial deve ser reconciliada no vault.
- **Autosave e saída:** `lib/conteudo/autosave.ts` serializa gravações e preserva o texto em falhas; `salvarBloco` faz comparação atômica do valor anterior. `hooks/use-unsaved-changes.ts:70` reúne pendências para links, histórico e logout. Em navegadores sem Navigation API, entradas anteriores ao rastreamento podem exigir restaurar o formulário substituindo o ramo Avançar; os dados locais são preservados.
- **CRM:** `components/admin/analytics/LeadsQueue.tsx:98` e `app/admin/leads/actions.ts:74` concentram atendimento, etapa e próximo passo, edição de contato, filtros, prioridade e histórico paginado. Encerrar lead limpa ação pendente. Conversão mantém seu marco temporal. Contatos e downloads de materiais passam a ter classificação explícita.
- **Captação:** `lib/contact.ts:48` e `app/api/leads/route.ts:81` usam UUID + hash canônico por submissão, mantendo retry após troca de rede. Storage do navegador guarda somente hash e UUID; identificadores técnicos entram na anonimização do lead.
- **Orçamentos:** associação com lead, listagem paginada, estado salvo por snapshot, autorização por papel e revisão de PDF por hash do conteúdo. URLs são renovadas no download; geração confirma HTTP e identidade do orçamento, usa caminho único e compara versão antes de atualizar o registro. PDFs do acervo permanecem acessíveis com aviso de versão não verificada.
- **Notificações:** `lib/push/dispatch.ts:39` revalida a pendência, direciona ações vencidas ao responsável e novos leads conforme preferências, guarda recibos por dispositivo e limita o trabalho por prazo. Entregas não tentadas voltam à fila sem consumir tentativa. Continua sendo entrega com possíveis repetições após interrupção entre envio e comprovante, não garantia de envio único.
- **Analytics:** períodos parciais usam baseline equivalente; conversão inclui desqualificados no denominador; estado atual da coorte é identificado como atual. Falhas GA4/GSC/inspeção ficam distintas de zero. Consultas ausentes respeitam limites de cobertura, sugestões exibem evidência/aprovação e séries param no mês escolhido.
- **Carregamento e interface:** `PublicLayout` cria uma fronteira para o código institucional; abas e preview pesados ficam sob demanda; projeções e paginação reduzem respostas. Dashboard usa métricas do fluxo de orçamentos existente; a rota Propostas é um redirect. Navegação respeita papéis, largura recolhida, foco, tablet e safe area. Erros têm recuperação explícita em `app/admin/error.tsx:7`.

### Evidência de validação e carregamento

Testes offline aprovados: `test:conteudo` (ordenação, autosave, estados e renderer), `test:analytics` (76 asserções nos mapas/funil e 39 de integridade, além do aprendizado), `test:crm` (idempotência, concorrência de gravação/PDF e entrega parcial/prazo do push) e `test:admin` (links/histórico/logout, estado do Next e bloqueio do harness em produção). `typecheck` passou; lint completo sem erros, seguido de lint sem erros e sem avisos nos arquivos alterados na revisão final. O build final de produção passou, incluindo TypeScript e geração de 98 páginas. As exceções do `.gitignore` e o CI incluem os três novos testes offline; `git diff --check` passou.

Comparação com o build local anterior disponível, usando a soma dos mesmos conjuntos de chunks em `entryJSFiles` + `rootMainFiles`, sem compressão ou cache:

| Rota | Antes | Depois | Redução |
|---|---:|---:|---:|
| `/admin/analytics` | 1.560.549 bytes | 880.442 bytes | 43,6% |
| `/admin` | 807.357 bytes | 747.442 bytes | 7,4% |
| `/admin/orcamentos/novo/form` | 845.608 bytes | 787.391 bytes | 6,9% |
| `/admin/leads` | 888.603 bytes | 838.908 bytes | 5,6% |
| `/admin/posts/[id]` | 844.977 bytes | 797.849 bytes | 5,6% |
| `/admin/conteudo` | 977.127 bytes | 948.166 bytes | 3,0% |

Isso mede JavaScript inicial associado à rota, não tempo real de resposta, transferência comprimida ou Core Web Vitals. O baseline é o artefato local anterior disponível, não um experimento controlado de produção. O build encontrou o harness local ignorado pelo Git; `proxy.ts:4` agora bloqueia `/dev-harness/**` em produção antes de qualquer consulta, com regressão automatizada e matcher confirmado no `functions-config-manifest.json` gerado. Nenhum desses arquivos locais foi apagado. Os comandos de validação encerraram; nenhum servidor de desenvolvimento ou stack local foi iniciado.

### Banco e entrada em operação

Migration preparada: `supabase/migrations/20260929141528_admin_reliability.sql`. Deve ser aplicada **antes** do deploy correspondente. Contém colunas/índices, RPCs atômicas, guardas de papel, agregados com RLS e extensão da retenção. A normalização dos telefones legados preserva `atualizado_em`, para não reiniciar o prazo de retenção. O backfill de materiais usa somente os quatro marcadores determinísticos da captura antiga.

A migration foi aplicada no projeto hospedado `sfqaknxomxwmviarpwfy` (SHA-256 `9185309e792c5b0f6ed603db4335a69c19ee8dd437b19f7043eb167e0ac635a2`). As definições anteriores das funções foram guardadas localmente, sem exportação dos dados dos leads. A conciliação parte de main `40b78e9`, preserva as migrations 032–034 e os recursos recentes de feedback, LGPD, WhatsApp e gestos. Deploy, regeneração dos snapshots históricos e smoke visual autenticado ainda não foram concluídos. Os relatórios existentes não são corrigidos retroativamente pelo novo coletor; a próxima geração aplica as regras novas. A contagem do dashboard distingue ausência dos novos campos de um valor zero.

Checks SQL preparados (exigem banco já migrado e execução autorizada): `npm run test:admin:db` testa staging/publicação/versões/RLS dentro de rollback; `npm run test:leads` testa CRM/RLS/atendimento/retenção de marcos e idempotência dentro de rollback. Esses checks não iniciam infraestrutura.

Smoke após implantação: testar os quatro papéis, editar e sair por link/histórico/logout, atendimento com e sem próxima ação, lead→orçamento→registro de envio, PDF vencido e alterado, preferências/dispositivo revogado, Analytics parcial/fonte indisponível e impressão das abas sob demanda.

> [!info] Migração para vault
> Este arquivo era duplicado em `Docs/ADMIN_SETUP.md` e `Docs/site/ADMIN_SETUP.md`. Consolidado aqui como fonte única. Referenciado por [[stack-nextjs-supabase]].

## Visão Geral

O Sistema Admin Berkahn é um painel administrativo para gerenciar:
- **Posts de Blog** (Atualidade)
- **Leads e operação comercial**
- **Conteúdo e documentação interna**
- **Orçamentos vinculados a leads**
- **Apresentações Executivas**
- **Propostas legadas** (a antiga rota administrativa redireciona para Orçamentos)

## Arquitetura

```
berkahn.com.br (Site Público)     admin.berkahn.com.br (Painel Admin)
         │                                    │
         ▼                                    ▼
   Next.js SSG + ISR                   Next.js Dynamic
   (mesmo build, `npm run build`)      server-side
         │                                    │
         └──────────────┬─────────────────────┘
                        │
                   Supabase
              (Database + Auth + Storage)
```

O admin é uma superfície operacional autocontida: `ConditionalFooter` não
renderiza em nenhuma rota `/admin/**`. O footer institucional permanece apenas
nas páginas públicas, onde navegação legal e social fazem sentido.

### Shell e hierarquia responsiva

No desktop, o admin mantém a sidebar. No celular, a navegação principal fixa
os atalhos adequados ao papel: comercial/owner com Dashboard, Leads e Orçamentos;
conteúdo com Dashboard, Conteúdo e Posts; viewer com Dashboard, Analytics e Documentações.
Os demais destinos permitidos ficam em **Mais**. Header, conteúdo, drawer e barra inferior
respeitam as safe areas do iOS/PWA.
Nas três rotas principais, o gesto horizontal no conteúdo troca para a próxima
aba permitida ao papel. O gesto não começa sobre controles, diálogos, gráficos
ou listas com rolagem horizontal; as bordas da tela ficam livres para o gesto
de voltar do sistema. A barra inferior continua sendo a navegação explícita.

O Dashboard prioriza o backlog comercial ativo: leads novos, ações vencidas e
leads sem responsável. Falha de consulta nunca é convertida em zero ou atividade
fictícia. Analytics usa as abas Resumo, Aquisição, Conteúdo e Diagnóstico; todas
as seções são carregadas sob demanda; Exportar PDF e Ctrl/Cmd+P preparam o relatório completo. A impressão pelo menu nativo do navegador identifica as seções abertas. A Inbox é a operação móvel de
Leads; o Kanban também oferece navegação por etapa no celular. A prévia do lead mantém altura estável, rolagem interna e gesto no cabeçalho para fechar.

> [!warning] Corrigido em 2026-07-31
> Este diagrama dizia `output: "export"` para o site público, e a seção de
> produção mandava usar `npm run build:static` com output `out`. **Nunca foi o
> que roda.** `vercel.json` define `buildCommand: "npm run build"`, que vale
> para os dois projetos e tem precedência sobre a configuração do dashboard.
> O modo estático foi removido do repositório — ver `next.config.ts`.

## Estrutura de Arquivos

```
app/
├── admin/                    # Rotas do admin
│   ├── layout.tsx           # Layout com sidebar/header
│   ├── page.tsx             # Dashboard
│   ├── login/
│   │   └── page.tsx         # Página de login
│   ├── posts/
│   │   ├── page.tsx         # Lista de posts
│   │   ├── new/page.tsx     # Criar post
│   │   └── [id]/page.tsx    # Editar post
│   ├── propostas/
│   │   └── page.tsx         # Lista de propostas
│   ├── apresentacoes/
│   │   └── page.tsx         # Lista de apresentações
│   └── configuracoes/
│       └── page.tsx         # Configurações
├── ...                       # Outras rotas do site público

components/
├── admin/                    # Componentes do admin
│   ├── AdminLayoutClient.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── DashboardContent.tsx
│   ├── LoginForm.tsx
│   └── posts/
│       ├── PostsTable.tsx
│       └── PostEditor.tsx
├── ...                       # Outros componentes

lib/
├── supabase/                 # Cliente Supabase
│   ├── client.ts            # Cliente para browser
│   ├── server.ts            # Cliente para server
│   ├── middleware.ts        # Middleware de auth
│   └── index.ts             # Re-exports

types/
├── admin.ts                  # Tipos do admin
├── ...                       # Outros tipos

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Schema do banco
```

## Setup Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a URL e a chave anônima do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# URLs
NEXT_PUBLIC_SITE_URL=https://berkahn.com.br
NEXT_PUBLIC_ADMIN_URL=https://admin.berkahn.com.br
```

### 3. Executar Migrations

1. Acesse o SQL Editor no painel do Supabase
2. Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Execute o script

### 4. Configurar Storage Buckets

No painel do Supabase, vá em Storage e crie os buckets:
- `posts` (público) - para imagens dos posts
- `presentations` (público) - para assets das apresentações
- `proposals` (privado) - para anexos das propostas

### 5. Criar Usuário Admin

No painel do Supabase, vá em Authentication > Users e crie um usuário com email/senha.

## Desenvolvimento

### Rodar em desenvolvimento

```bash
npm run dev
```

O admin estará disponível em `http://localhost:3000/admin`

### Build

```bash
# Único build. Serve os dois domínios.
npm run build
```

## Configuração de Produção

Dois projetos Vercel apontando para o **mesmo repositório e o mesmo build**:

| Projeto | Domínio | Build |
|---|---|---|
| `berkahn` | `berkahn.com.br` | `npm run build` (de `vercel.json`) |
| `berkahn-admin` | `admin.berkahn.com.br` | `npm run build` (de `vercel.json`) |

O que separa os dois é o **middleware**, não o build: `middleware.ts` tem matcher
`['/', '/admin/:path*']` e exige sessão em tudo sob `/admin`. O output é `.next`
nos dois.

### Opção 2: Projeto Único

Configure um único projeto Vercel com o build completo:
- Domains: `berkahn.com.br`, `admin.berkahn.com.br`
- Build Command: `npm run build`

### Configurar DNS na Hostinger

1. Acesse o painel da Hostinger
2. Vá em DNS Zone
3. Adicione registro CNAME:
   - Nome: `admin`
   - Aponta para: `cname.vercel-dns.com`

## Módulos

### CRM de leads

`/admin/leads` é a fila operacional única. A Inbox usa paginação server-side de 25; o Kanban carrega até 150 resultados filtrados e oferece drag-and-drop mais seletor acessível. Busca, filtros, badge de não visualizados e KPIs por coorte de 28 dias são compartilhados. O detalhe concentra contato, origem consentida, funil, responsável, prioridade, último status, próxima ação, timeline, retry da notificação, arquivos e vínculos comerciais. A lista antiga foi removida de `/admin/analytics`, que mantém somente agregados e aprendizado.

O funil canônico é `novo` → `em_contato` → `qualificado` → `proposta_enviada` → `convertido`, com `desqualificado` exigindo motivo. `qualificado_em` registra a primeira qualificação e não é apagado por regressão posterior; `convertido_em` representa fechamento efetivo. Cadastro manual aceita WhatsApp, telefone, email e indicação, mostra candidatos a duplicidade e nunca dispara GA4.

As mutações de funil vivem em RPCs transacionais da migration `024_leads_crm_supabase.sql`; `027_lead_operations_artifacts.sql` acrescenta equipe, prioridade, resumo operacional e anexos, e `029_lead_artifact_atomic_delete.sql` torna a remoção do vínculo + entrada na fila de Storage uma única transação. A migration `031_admin_members_multiuser.sql` reaproveita `lead_responsaveis` como cadastro de membros, vincula cada linha a `auth.users` e substitui o email canônico por papéis ativos. Logs usam `Lead <prefixo-do-UUID>` em `entity_name`; PII e notas ficam em `details` e seguem a retenção. A `032_lead_lgpd_hardening.sql` (aplicada em 2026-09-22) completa a anonimização (utm, landing_page, sheet_sync_error; `origem_legado` fica por ser a chave de idempotência do import), faz o relógio de retenção contar de `GREATEST(criado_em, ultimo_contato_em)` em vez de `atualizado_em`, cria a flag de retenção legal (`set_lead_retention_exception`, só owner) e a eliminação auditada a pedido do titular (`anonymize_lead_on_request`, só owner, recusa convertido ou lead em retenção), e amarra a autoria de `activity_logs` a `auth.uid()` por trigger. As duas RPCs aparecem no detalhe do lead, na seção "Privacidade (LGPD)", visível só ao owner. A `033_leads_busca_e_limpeza.sql` cria índices GIN trigram em nome, email e telefones para a busca com ILIKE; as colunas `sheet_sync_*` continuam porque `scripts/leads/import-leads-csv.mjs` ainda as grava. O mural de feedback (034) está em [[admin-feedback]]. A matriz anon / membro sem papel / comercial / conteúdo / proprietário / service role, a reversão atômica, a fila de arquivos e o payload push sem PII são cobertos por RLS e pelos testes transacionais do CRM.

### Identidade e papéis

O acesso é por convite no Supabase Auth. Cada pessoa recebe email, define a própria senha em `/admin/definir-senha` e usa o mesmo login em todos os dispositivos. A conta `contato.berkahn@gmail.com` foi preservada como `owner`; não existe mais senha compartilhada na UX. `/admin/configuracoes` concentra convite, ativação e papel:

| Papel | Acesso principal |
|---|---|
| `owner` | Todos os módulos, convites e configuração da equipe |
| `comercial` | Leads, orçamentos, propostas e analytics |
| `conteudo` | Conteúdo, posts, documentações, apresentações e analytics |
| `viewer` | Dashboard, analytics e documentações em leitura |

O `proxy.ts:4` bloqueia rotas incompatíveis antes da renderização; RLS e RPCs repetem a autorização no banco. `is_berkahn_admin()` permanece como guarda comercial para RPCs legados, enquanto `has_admin_role()` expressa leituras e mutações dos outros domínios.

Arquivos de até 6 MB (`PDF`, `DOCX`, `XLSX`, `JPEG`, `PNG`, `WebP`) usam upload assinado direto ao bucket privado `lead-files`; o arquivo não atravessa a função Vercel. Arquivos grandes e pastas permanecem no Drive e entram como URL HTTPS. O Drive não é duplicado nem sincronizado automaticamente. Ao anonimizar, links externos são removidos e objetos privados entram em `lead_storage_cleanup` até a Edge Function confirmar a exclusão.

A PWA do admin usa o manifesto estático `public/admin/manifest.webmanifest`, servido em `/admin/manifest.webmanifest`, com `id: /admin/`, `scope: /admin` e `start_url: /admin`. O escopo inclui o endereço inicial e as subrotas, sem alterar o identificador de instalações existentes. O manifesto público continua separado e abre `/`. Instalações antigas que ainda abrem a home precisam ser removidas e instaladas novamente. O `/admin-sw.js` permanece exclusivo para push, sem cachear telas ou PII. O shell captura `beforeinstallprompt` mesmo antes de abrir Configurações; a tela oferece o botão quando o navegador emite esse evento e orienta a instalação manual pelo menu do Chrome/Edge no PC ou pelo Compartilhar no iPhone. Navegadores integrados podem não oferecer instalação. Cada usuário escolhe os tipos de alerta e cada dispositivo opta separadamente por Web Push. A outbox `lead_notification_outbox` recebe apenas título, texto, URL genérica e tag; não contém nome, contato ou UUID do lead. Novos contatos e próximas ações vencidas são deduplicados. As chaves abaixo foram configuradas nos dois projetos Vercel em 2026-08-14:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:administrativo@berkahn.com.br
LEAD_PUSH_CRON_SECRET
```

O mesmo `LEAD_PUSH_CRON_SECRET` está no Supabase Vault como `lead_push_cron_secret`. O job `berkahn-lead-push-dispatch` (job 1) chama `https://admin.berkahn.com.br/api/admin/push/dispatch` a cada 15 minutos. O dispatcher é aceito sem cookie somente nessa rota e autentica por segredo constante; no domínio público `/api/admin/**` continua 404. Ele envia apenas para membros `owner`/`comercial` ativos, respeita a preferência individual e registra `skipped_no_subscribers` quando não há dispositivo elegível, em vez de marcar falsamente como enviado. Para receber notificações, cada navegador precisa abrir `/admin/configuracoes`, instalar a PWA se desejado e ativar a assinatura.

### Analytics mensal hospedado

`.github/workflows/analytics-monthly.yml` executa toda quarta-feira às 12:00 UTC para atualizar o mês corrente como parcial, com janela equivalente e lag do GSC. No dia 4 às 12:00 UTC executa também o fechamento oficial do mês anterior. A concorrência é serializada por workflow. O job reutiliza `scripts/analytics/generate-report.mjs`, grava `analytics_snapshots` no Supabase e aceita disparo manual com `month=AAAA-MM`; se o mês solicitado for o corrente, o script marca automaticamente como parcial. OAuth vem dos segredos JSON `GOOGLE_OAUTH_CLIENT_JSON` e `GOOGLE_OAUTH_TOKENS_JSON`; o job também exige `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_KEY`. Uma falha deixa o workflow vermelho e não depende de tarefa local, computador ligado ou worktree persistente.

Orçamentos e propostas têm `lead_id`. “Criar orçamento” abre o wizard existente com contato e vínculo preenchidos; salvar rascunho não move o funil e finalizar somente registra atividade. O módulo de propostas continua placeholder.

Importação histórica: `node --env-file=.env.local scripts/leads/import-leads-csv.mjs --file=C:\\caminho-fora-do-repo\\leads.csv --dry-run`, seguido de `--apply`. O identificador `sheet:<hash-do-arquivo>:<linha>` torna a repetição idempotente sem fundir linhas repetidas. O script não imprime PII.

Retenção: leads não convertidos, sem exceção e sem atualização por 24 meses são candidatos. A RPC revalida e bloqueia o registro, anonimiza transacionalmente lead, logs, orçamentos, propostas, resumo operacional e vínculos externos. PDFs de orçamento ficam em `retencao_storage_pendente`; uploads de lead ficam em `lead_storage_cleanup`. Só depois a Edge Function `lead-retention` remove os objetos dos buckets `orcamento-pdfs` e `lead-files`; falhas preservam os paths para retry. Em 2026-08-14, a função foi publicada na versão 1 sem verificação JWT, protegida por `RETENTION_CRON_SECRET` no ambiente da Edge e `lead_retention_cron_secret` no Vault. O job `berkahn-lead-retention-monthly` (job 2) roda às 03:15 no primeiro dia de cada mês. O rollout encontrou zero candidatos e zero objetos pendentes; não foi feita execução destrutiva manual.

### Posts de Blog

O módulo de posts permite:
- Criar/editar posts em Markdown
- Upload de imagens
- Categorização e tags
- Agendamento de publicação
- Preview em tempo real

### Apresentações (Em Desenvolvimento)

O módulo de apresentações permitirá:
- Criar slides interativos
- Compartilhar via link único
- Rastrear visualizações
- Exportar para PDF

### Propostas (Em Desenvolvimento)

O módulo de propostas permitirá:
- Criar orçamentos detalhados
- Enviar por email
- Rastrear status (enviado, visualizado, aprovado)
- Gerar relatórios

## Integrações

### Integrações operacionais

- Supabase é fonte única de leads e PII.
- Google Sheets e Apps Script estão desativados; alertas opcionais usam Web Push sem PII — ver [[google-sheets]].
- n8n não participa do fluxo de leads atual.

### Vercel Deploy Hook

Configure um deploy hook no Vercel para rebuild automático:
1. Vá em Project Settings > Git > Deploy Hooks
2. Crie um hook e adicione a URL em `.env.local`:
   ```
   VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
   ```

## Segurança

- **Autenticação**: Supabase Auth por convite, email/senha individual e recuperação de senha
- **RLS**: Row Level Security em todas as tabelas
- **Middleware**: Proteção de rotas `/admin/*`
- **HTTPS**: Obrigatório via Vercel

## Troubleshooting

### Erro de login "Invalid API key"
Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas.

### Erro "Cannot read properties of null (reading 'getUser')"
O Supabase não está inicializado corretamente. Verifique as variáveis de ambiente.

### Página de admin retorna 404
Verifique se o middleware está ativo e se a rota está sob `/admin`. (Até
2026-07-31 esta seção culpava `output: "export"`, que não existe mais no
projeto.)
