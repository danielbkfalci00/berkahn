---
tipo: memory
criado: 2026-05-27
atualizado: 2026-05-27
tags:
  - ai/memory
  - status/active
  - source/manual
  - project/blog
  - project/seo-aeo
ai_summary: "Setup Google APIs (GA4 Data API + Search Console API) para automação de relatório mensal de performance. Service account em secrets/google-service-account.json (gitignored). Property ID + site URL em .env.local. Comando /performance gera MD+HTML."
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

# Bootstrap inicial (3 meses)
node --env-file=.env.local scripts/analytics/generate-report.mjs --bootstrap
```

Output:
- `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.md` (vault, versionado)
- `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.html` (apresentação)
- KPIs atualizados em `00-meta/projetos/blog.md` e `00-meta/projetos/seo-aeo.md`
- Fixture salva em `scripts/analytics/fixtures/YYYY-MM.json` (gitignored)

## Scheduled task

`berkahn-performance-mensal` (cron `0 9 1 * *`, todo dia 1 às 9h)
- Invoca `/performance` em sessão fresca
- Notifica Bruno via PushNotification ao concluir

Listar com `mcp__scheduled-tasks__list_scheduled_tasks`.

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `invalid_grant` | JSON key expirou | Renovar via comando acima |
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
