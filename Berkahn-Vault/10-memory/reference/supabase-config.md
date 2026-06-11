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

## Onde ficam os scripts

`scripts/articles/add-article-*.mjs` (todo o diretório `scripts/` está gitignored — secrets hardcoded ali NÃO vazam, mas mesmo assim use env vars por convenção).

## Histórico de incidentes

- 2026-05-21: Supabase service_role key vazou em git público (commit `b638b21`). Rotacionada. Sanitizado o working tree, mas chave antiga ainda no git history (`.claude/prompts/article-implementation-prompt.md:373` antes do commit `e6972af`).

## Referências

- Outras credenciais: [[git-remote]]
- Pipeline blog (consome Supabase): [[blog-pipeline]]
- Artigos publicados (tabela posts): [[artigos-publicados]]
