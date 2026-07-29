---
tipo: memory
criado: 2026-05-27
atualizado: 2026-07-29
tags:
  - ai/memory
  - status/active
  - source/manual
  - project/blog
  - project/seo-aeo
ai_summary: "Setup Google APIs (GA4 Data API + Search Console API) para o relatório mensal. Auth por OAuth refresh token em secrets/oauth-tokens.json. ATENÇÃO: invalid_grant recorrente porque o consent screen está em modo Testing (token morre em 7 dias) — passo a passo para publicar o app está nesta nota. Comando /performance gera MD+HTML."
status: active
subtipo: reference
---

# Google APIs Setup, GA4 + GSC

## Contexto

Setup feito em 2026-05-27 para automatizar relatório mensal de performance do blog Berkahn. Substitui análise 100% manual no GA4 e GSC UI por pipeline `/performance` que gera MD source-of-truth no vault e HTML branded para apresentação em reunião.

## O que está conectado

| Item | Valor |
|------|-------|
| Conta Google | `contato.berkahn@gmail.com` |
| Projeto GCP | `berkahn-analytics` |
| Service account | `analytics-reader@berkahn-analytics.iam.gserviceaccount.com` |
| Chave JSON | `secrets/google-service-account.json` (gitignored) |
| GA4 Property ID | salvo em `.env.local` como `GA4_PROPERTY_ID` |
| GSC site URL | `sc-domain:berkahn.com.br` |
| APIs habilitadas | analyticsdata.googleapis.com, searchconsole.googleapis.com |

## Quando a chave expira

JSON keys do GCP expiram em **90 dias por padrão** (configurável até 7 dias mínimo, sem expiração não é recomendado).

**Próxima renovação alvo**: 2026-08-25 (90 dias após criação)

Como renovar:
```powershell
$env:Path += ";$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
gcloud iam service-accounts keys create secrets/google-service-account.json `
  --iam-account=analytics-reader@berkahn-analytics.iam.gserviceaccount.com `
  --project=berkahn-analytics
```

Depois rodar `node --env-file=.env.local scripts/analytics/test-auth.mjs` para validar.

O `test-auth.mjs` no início do cron mensal avisa se a chave estiver perto de expirar.

## Como usar

Comando: `/performance` (ver [[performance]] em `.claude/commands/`)

```bash
# Último mês fechado (default)
node --env-file=.env.local scripts/analytics/generate-report.mjs

# Mês específico
node --env-file=.env.local scripts/analytics/generate-report.mjs --month 2026-04

# Mês corrente, parcial (janela cortada no lag do GSC)
node --env-file=.env.local scripts/analytics/generate-report.mjs --partial

# Bootstrap inicial (3 meses)
node --env-file=.env.local scripts/analytics/generate-report.mjs --bootstrap
```

Output:
- `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.md` (vault, versionado)
- `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.html` (apresentação)
- KPIs atualizados em `00-meta/projetos/blog.md` e `00-meta/projetos/seo-aeo.md` — **pulado em run parcial**
- Fixture em `scripts/analytics/fixtures/YYYY-MM.json`, ou `YYYY-MM-partial.json` (gitignored)

Regras do modo parcial em [[analytics-methodology]].

> [!warning] O pipeline não é versionado
> `/scripts/` inteiro é gitignored por design (o cron roda local, não na Vercel). `period.mjs`, `generate-report.mjs`, `insights.mjs` e os templates existem **só na máquina do Bruno** — não há cópia no GitHub. Perder a máquina significa perder o pipeline.
>
> O mesmo vale para `~/.claude/scheduled-tasks/berkahn-performance-mensal/SKILL.md`, que é caminho de usuário e não de projeto. **Não foi copiado para o repo de propósito**: ~90% do conteúdo já está em `.claude/commands/performance.md`, que é versionado, e duplicar quebraria a regra de um fato em um lugar. O que se perderia é só a instrução operacional do cron ("o que fazer", "reportar ao Bruno") — reconstruível a partir do command.

## Scheduled task

`berkahn-performance-mensal` (cron `0 9 1 * *`, todo dia 1 às 9h)
- Invoca `/performance` em sessão fresca
- Notifica Bruno via PushNotification ao concluir

Listar com `mcp__scheduled-tasks__list_scheduled_tasks`.

## `invalid_grant` recorrente: consent screen em Testing

**Sintoma**: `test-auth.mjs` retorna `invalid_grant` em GA4 e GSC ao mesmo tempo, poucas semanas depois de uma reautorização bem-sucedida.

**Ocorrências**: maio/2026, 2026-07-01, 2026-07-29. Três vezes em ~3 meses.

**Evidência que aponta a causa** (levantada em 2026-07-29):

- O token foi emitido em 2026-07-01 12:29 e `secrets/oauth-tokens.json` **nunca foi reescrito** desde então. O listener `on('tokens')` em `lib/auth.mjs` regrava o arquivo a cada refresh, então nenhum refresh chegou a funcionar.
- O fluxo de autorização exige clicar em **Avançado → Acessar berkahn-analytics CLI (não seguro)**. Essa tela só aparece em app **não publicado**.
- App em **Testing** expira refresh token em **7 dias**, sempre. Token de 01/07 estaria morto em 08/07, muito antes do cron de 01/08.

**Correção definitiva** (ação manual do Bruno, no Console):

1. Abrir https://console.cloud.google.com/auth/audience?project=berkahn-analytics logado como `contato.berkahn@gmail.com`. Caminho legado, se o novo não abrir: https://console.cloud.google.com/apis/credentials/consent?project=berkahn-analytics
2. Conferir que o projeto no topo é `berkahn-analytics`
3. Localizar **Publishing status** — estará em `Testing`
4. Clicar em **PUBLISH APP** e confirmar
5. Status deve virar **`In production`**
6. Reautorizar uma vez: `node --env-file=.env.local scripts/analytics/oauth-login.mjs`
7. Validar: `node --env-file=.env.local scripts/analytics/test-auth.mjs`

**Sobre o aviso de verificação**: publicar exibe um alerta sobre verificação do app. Não se aplica aqui — o Google só exige verificação para *sensitive/restricted scopes* distribuídos a usuários fora da organização. Os dois scopes são read-only, o único usuário é o Bruno, nada é distribuído. O app fica em produção sem entrar em fila.

A tela "app não verificado" pode continuar aparecendo em reautorizações futuras. É cosmético e não afeta a validade do token.

**Como confirmar que resolveu**: o cron de 2026-09-01 rodar sozinho e gerar o relatório de agosto sem intervenção. Sinal antecipado: rodar `test-auth.mjs` ~10 dias após publicar e passar.

> [!warning] Hipótese forte, não confirmada
> Não é possível ler o publishing status pela API — só pelo Console. O diagnóstico se apoia no sintoma (7 dias bate exatamente) e na tela de app não verificado. Se após publicar o problema voltar em 01/10, a causa é outra e vale investigar revogação em myaccount.google.com/permissions.

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `invalid_grant` | **Causa provável: consent screen em modo Testing** — nesse modo o Google expira refresh tokens em **7 dias**, não em 6 meses | Curto prazo: `node scripts/analytics/oauth-login.mjs` → autorizar no browser. Definitivo: publicar o app (seção "`invalid_grant` recorrente" acima) |
| Cron `berkahn-performance-mensal` sem output visível | Falha silenciosa (ex: `invalid_grant`). Desde 2026-07-01 o `generate-report.mjs` grava `~/.claude/scheduled-tasks/berkahn-performance-mensal/last-error.log` com stack trace | Ler o JSON no path acima; corrigir causa; re-rodar `node --env-file=.env.local scripts/analytics/generate-report.mjs` (sucesso apaga o log automaticamente) |
| `GSC site não encontrado` | SA não tem acesso ao site GSC | GSC → Settings → Users → add SA com permission Restricted |
| `GA4_PROPERTY_ID missing` | Var ausente em .env.local | Pegar em GA4 Admin → Property Settings (9-10 dígitos) |
| `Caller does not have permission` no GA4 | SA não tem acesso à property | GA4 Admin → Property Access Management → add SA como Viewer |
| URL Inspection rate limit | >60 req/min | Script já throttle 250ms; baixar paralelismo se persistir |

## Custos

- Analytics Data API: free tier 25k req/dia (Berkahn usa ~10/mês)
- Search Console API: free
- GCP project: sem billing necessário pra esse uso

## Referências

- Estratégia SEO/AEO: [[seo-aeo-strategy]]
- Pipeline blog: [[article-pipeline]]
- Comando `/performance`: `.claude/commands/performance.md`
- Hub blog (KPIs): [[blog]]
- Hub SEO/AEO: [[seo-aeo]]
