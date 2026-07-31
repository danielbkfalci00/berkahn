---
tipo: memory
criado: 2026-04-13
atualizado: 2026-07-31
tags:
  - ai/memory
  - status/active
  - source/manual
ai_summary: "Config Supabase do projeto Berkahn — keys, tabelas, buckets, tipagem. LEIA O HISTÓRICO DE INCIDENTES ANTES DE MEXER EM CREDENCIAL: três vazamentos até 2026-07-31, dois deles no mesmo dia (senha da conta Auth publicada no bundle do admin por meses, e a mesma string sendo a senha do Postgres). Regra que saiu deles: nenhum segredo em arquivo \"use client\" nem em variável NEXT_PUBLIC_."
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

`scripts/articles/add-article-*.mjs` (todo o diretório `scripts/` está gitignored — secrets hardcoded ali NÃO vazam, mas mesmo assim use env vars por convenção).

## Histórico de incidentes

- **2026-07-31: senha da conta Supabase Auth publicada no bundle do admin.** `components/admin/LoginForm.tsx` era um Client Component e declarava `ACCESS_CODE` como constante de módulo — e essa string era passada como `password` para `signInWithPassword`. Não era um portão da aplicação: era a senha da conta `contato.berkahn@gmail.com`. Quem lesse o chunk autenticava direto contra a API do Supabase, sem passar pelo site, e recebia JWT `authenticated` — CRUD via RLS em `posts`, `orcamentos`, `proposals`, `presentations`, `analytics_tasks` e comentários. Legível num `curl` a `/_next/static/chunks/app/admin/login/page-*.js`, HTTP 200, **desde que o admin existe**. Corrigido no PR #42 movendo a autenticação para Server Action, sem segredo no repositório nem no ambiente. Senha rotacionada. **A exposição durou meses — os logs de auth do Supabase são a única forma de saber se foi usada.**
- **2026-07-31: a senha do Postgres era a mesma string.** Descoberta na mesma sessão, ao configurar `DATABASE_URL` para rodar migrations. Como o `ACCESS_CODE` estava público, a connection string inteira era reconstruível (o project ref e a região também são públicos). Rotacionada. Lição: senha de banco e código de acesso do admin **nunca** devem coincidir.
- 2026-05-21: Supabase service_role key vazou em git público (commit `b638b21`). Rotacionada. Sanitizado o working tree, mas chave antiga ainda no git history (`.claude/prompts/article-implementation-prompt.md:373` antes do commit `e6972af`).

> [!warning] Regra que sai destes três incidentes
> Nenhum segredo em arquivo com `"use client"`, e nenhum segredo em variável com prefixo `NEXT_PUBLIC_` — os dois vão para o bundle público. Autenticação e comparação de credencial vivem no servidor. Ver [[comentarios-inline-documentacoes]] para o padrão de Server Action já aplicado.

## Referências

- Outras credenciais: [[git-remote]]
- Pipeline blog (consome Supabase): [[blog-pipeline]]
- Artigos publicados (tabela posts): [[artigos-publicados]]
