---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-18
tags:
  - ai/memory
  - status/active
  - source/manual
ai_summary: "Config Supabase do projeto Berkahn — keys, tabelas, buckets, tipagem. LEIA O HISTÓRICO DE INCIDENTES ANTES DE MEXER EM CREDENCIAL: três vazamentos, e o de 2026-05-21 continua ABERTO — a service_role key do commit público b638b215 nunca foi rotacionada (verificado por hash em 2026-08-18) e bypassa RLS na base de produção. Regra que saiu deles: nenhum segredo em arquivo use client nem em variável NEXT_PUBLIC_."
status: active
subtipo: reference
---

# Supabase — Configuração

## Project URL

`https://YOUR-PROJECT.supabase.co` (valor real em `.env` → `SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_URL`)

## Keys

| Key | Variável .env | Onde usar |
|-----|---------------|-----------|
| Anon (public) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend (RLS-aware) |
| Service role | `SUPABASE_SERVICE_KEY` ou `SUPABASE_SERVICE_ROLE_KEY` | Server-side ONLY (bypassa RLS) |

⚠️ **NUNCA hardcodar service_role key em arquivos versionados.** A chave bypassa RLS — acesso total ao DB. Sempre `process.env.SUPABASE_SERVICE_KEY`.

## Tabelas principais

| Tabela | Operações |
|--------|-----------|
| `posts` | INSERT (POST → 201), UPDATE (PATCH → 204) |
| `conteudo_pautas` | Fonte operacional do pipeline. Migration 012: trilhas independentes, RPC de reordenação e publicação atômica. Ver [[quadro-conteudo]] |
| `orcamentos` | CRUD via server actions em `app/admin/orcamentos/actions.ts`; trigger `BEFORE INSERT` gera `numero` BRK-YYYY-NNNN; PDFs no bucket `orcamento-pdfs` (signed URL 7 dias). Schema completo em `supabase/migrations/006_create_orcamentos.sql`. Ver [[orcamento-automacao]] |
| `proposals`, `presentations` | Existem em [migration 001](../../../supabase/migrations/001_initial_schema.sql) mas conceito diferente — não confundir com `orcamentos` (estimativa preliminar não-vinculante com faixa de valor) |
| `documentos` | HTML standalone dos relatórios e da estratégia, servido em `/admin/documentacoes`. Upsert por slug pelo cron e pelo seed. Migration 008 |
| `documento_threads`, `documento_comentarios` | Comentários inline ancorados a trechos dos documentos. Migration 009. RLS `FOR ALL TO authenticated`. Ver [[comentarios-inline-documentacoes]] |

## Buckets Storage

| Bucket | Visibilidade | Uso |
|--------|--------------|-----|
| `post-images` | público | covers de artigos do blog |
| `orcamento-pdfs` | privado, signed URLs 7d | PDFs gerados de estimativas |
| `orcamento-heroes` | privado, signed URLs 7d | hero images processadas via Sharp 1920×1080 webp |
| `orcamento-templates` | público | `modelo-orcamento.xlsx` (planilha-modelo — Sprint 4) |

## Tipagem do cliente (Database genérico)

Para `SupabaseClient<Database>` funcionar em supabase-js 2.90+, o tipo Database **precisa** ter `__InternalSupabase: { PostgrestVersion: "12" }` e `Relationships: []` em cada tabela. Sem isso, `.from('X').select()` retorna `never` silenciosamente. Workaround atual em [types/supabase-db.ts](../../../types/supabase-db.ts). Fix definitivo: rodar `supabase gen types typescript --project-id sfqaknxomxwmviarpwfy` para gerar tipos completos.

## Onde ficam os scripts

`scripts/conteudo/pauta.mjs` é versionado e lê a service role apenas de
`.env.local`. Scripts históricos continuam ignorados, mas hardcode permanece
dívida de higiene: ignorado não significa seguro para cópia, backup ou transcript.

## Histórico de incidentes

- **2026-07-31: senha da conta Supabase Auth publicada no bundle do admin.** `components/admin/LoginForm.tsx` era um Client Component e declarava `ACCESS_CODE` como constante de módulo — e essa string era passada como `password` para `signInWithPassword`. Não era um portão da aplicação: era a senha da conta `contato.berkahn@gmail.com`. Quem lesse o chunk autenticava direto contra a API do Supabase, sem passar pelo site, e recebia JWT `authenticated` — CRUD via RLS em `posts`, `orcamentos`, `proposals`, `presentations`, `analytics_tasks` e comentários. Legível num `curl` a `/_next/static/chunks/app/admin/login/page-*.js`, HTTP 200, **desde que o admin existe**. Corrigido no PR #42 movendo a autenticação para Server Action, sem segredo no repositório nem no ambiente. Senha rotacionada. **A exposição durou meses — os logs de auth do Supabase são a única forma de saber se foi usada.**
- **2026-07-31: a senha do Postgres era a mesma string.** Descoberta na mesma sessão, ao configurar `DATABASE_URL` para rodar migrations. Como o `ACCESS_CODE` estava público, a connection string inteira era reconstruível (o project ref e a região também são públicos). Rotacionada. Lição: senha de banco e código de acesso do admin **nunca** devem coincidir.
- 2026-05-21: Supabase service_role key vazou em git público (commit `b638b21`, criado em 2026-02-26). **Rotação registrada nesta data não aconteceu de fato** (ver alerta abaixo). Working tree sanitizado, chave ainda no git history (`.claude/prompts/article-implementation-prompt.md:373` antes do commit `e6972af`).

- [ ] @bruno Rotacionar a service_role key do Supabase exposta no commit público `b638b215` e atualizar `.env.local` e as variáveis da Vercel #pendencia

> [!danger] ABERTO: a chave do incidente de 2026-05-21 nunca foi rotacionada
> O registro dizia "Rotacionada". Está errado, e o erro é perigoso porque faz quem
> lê pular o item. Verificado em 2026-08-18 comparando o SHA-256 do token em
> `b638b215` com o do `SUPABASE_SERVICE_KEY` do `.env.local`: **hashes idênticos**.
> É a mesma chave, `role: service_role`, `ref: sfqaknxomxwmviarpwfy`, válida até
> 2036-01-20, e `service_role` bypassa RLS em toda a base de produção.
> O commit é de **2026-02-26**, é ancestral de `origin/main`, e o repositório
> `danielbkfalci00/berkahn` é **público**. O arquivo aparece em 6 commits.
> Exposição aberta há cerca de seis meses.
>
> **Rotacionar tem precedência sobre reescrever histórico.** Reescrita não fecha
> nada aqui, porque forks, clones e caches de terceiros já podem ter o blob.
> Depois de rotacionar: atualizar `.env.local`, as variáveis da Vercel e qualquer
> worktree; e conferir os logs de acesso do Supabase no período.
>
> Lição de método, a mesma de [[verificar-antes-de-descartar]]: "Rotacionada"
> escrito num registro não é prova de rotação. A prova é o hash.

> [!warning] Regra que sai destes três incidentes
> Nenhum segredo em arquivo com `"use client"`, e nenhum segredo em variável com prefixo `NEXT_PUBLIC_` — os dois vão para o bundle público. Autenticação e comparação de credencial vivem no servidor. Ver [[comentarios-inline-documentacoes]] para o padrão de Server Action já aplicado.

## Referências

- Outras credenciais: [[git-remote]]
- Pipeline blog (consome Supabase): [[blog-pipeline]]
- Artigos publicados (tabela posts): [[artigos-publicados]]
