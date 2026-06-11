---
description: Gera relatório mensal de performance (GA4 + GSC) — MD source-of-truth no vault + HTML branded para apresentação. Atualiza KPIs nos hubs blog.md e seo-aeo.md.
---

Relatório de performance Berkahn — rodado dia 1 de cada mês (via scheduled-task `berkahn-performance-mensal`) ou sob demanda.

## Argumentos aceitos

- `/performance` — gera o último mês fechado automaticamente
- `/performance 2026-04` — gera mês específico
- `/performance bootstrap` — gera os últimos 3 meses fechados de uma vez (primeira execução)
- `/performance fixture <name>` — usa fixture salva (não chama APIs)

## Pré-requisitos

Antes de rodar, garantir que existe:
1. `secrets/google-service-account.json` (service account com acesso a GA4 e GSC)
2. `.env.local` com `GOOGLE_SERVICE_ACCOUNT_PATH`, `GA4_PROPERTY_ID`, `GSC_SITE_URL`
3. Setup detalhado em `Berkahn-Vault/10-memory/reference/google-apis-setup.md`

## Execução

### 1. Validar credenciais (sempre)

```powershell
node --env-file=.env.local scripts/analytics/test-auth.mjs
```

Espera `✅ GA4 OK | ✅ GSC OK`. Se falhar, debug com a mensagem retornada.

### 2. Gerar relatório

```powershell
# Modo padrão (último mês fechado)
node --env-file=.env.local scripts/analytics/generate-report.mjs

# Mês específico
node --env-file=.env.local scripts/analytics/generate-report.mjs --month 2026-04

# Bootstrap (primeira execução, gera 3 meses)
node --env-file=.env.local scripts/analytics/generate-report.mjs --bootstrap
```

O orquestrador:
1. Busca dados GA4 + GSC do mês alvo e do mês anterior (para MoM)
2. Faz GET no Supabase para enriquecer slugs com títulos
3. Roda URL Inspection batched para todos os artigos publicados (indexação)
4. Calcula deltas, gera insights e ações priorizadas (P0/P1/P2)
5. Salva fixture em `scripts/analytics/fixtures/YYYY-MM.json`
6. Renderiza MD em `Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.md`
7. Renderiza HTML branded em `YYYY-MM-performance-blog.html` (mesmo dir)
8. Atualiza KPIs nos hubs `blog.md` e `seo-aeo.md`

### 3. Validar output

```powershell
# Vault validator (frontmatter canônico)
node scripts/vault-validate.mjs --json | findstr "performance-blog"
# Espera: sem issues

# Abrir HTML
start Berkahn-Vault/40-content/auditorias-seo/YYYY-MM-performance-blog.html
```

### 4. Reportar ao Bruno

- Path do MD + HTML
- 1-2 highlights do resumo executivo
- Quantas ações P0 foram identificadas
- Próximos passos manuais (se houver — ex: solicitar indexação no GSC)

## Regras

- **Categoria Supabase** (irrelevante para o relatório): N/A — o relatório é nota de vault, não vai pro Supabase
- **`copy-sem-travessao`**: aplicar em todos os insights e ações geradas (sem `—`, `–`, `-` estilísticos)
- **`subtipo: performance-mensal`**: novo subtipo. Se o linter rejeitar, adicionar à lista canônica em `.obsidian/plugins/obsidian-linter/data.json`
- **Idempotência**: rodar duas vezes pro mesmo mês sobrescreve sem warning. Bootstrap é seguro porque cada mês tem path único.
- **Wikilinks**: o template gera links pros hubs ([[blog]], [[seo-aeo]]) e contextos ([[seo-aeo-strategy]], [[article-pipeline]])

## Erros comuns

- `GA4 FAIL: invalid_grant` → JSON key expirou. Re-gerar via `gcloud iam service-accounts keys create ...`
- `GSC site não encontrado` → service account não tem acesso ao site. Adicionar manualmente em GSC > Settings > Users
- `GA4_PROPERTY_ID missing` → adicionar ao `.env.local`. Property ID está em GA4 Admin > Property Settings (9-10 dígitos)
- URL Inspection rate limit (60/min) → script já tem throttle de 250ms

## Referências

- Setup GCP: [[google-apis-setup]]
- Estratégia SEO/AEO: [[seo-aeo-strategy]]
- Pipeline blog: [[article-pipeline]]
- Hub blog (KPIs atualizados): [[blog]]
- Hub SEO/AEO: [[seo-aeo]]
