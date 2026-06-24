---
tipo: memory
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/memory
  - status/active
  - source/manual
ai_summary: Config Supabase do projeto Berkahn. Secrets vivem em .env (gitignored) — NUNCA hardcodar service_role key. URL e identificadores públicos podem ficar no vault.
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

- 2026-05-21: Supabase service_role key vazou em git público (commit `b638b21`). Rotacionada. Sanitizado o working tree, mas chave antiga ainda no git history (`.claude/prompts/article-implementation-prompt.md:373` antes do commit `e6972af`).

## Referências

- Outras credenciais: [[git-remote]]
- Pipeline blog (consome Supabase): [[blog-pipeline]]
- Artigos publicados (tabela posts): [[artigos-publicados]]
