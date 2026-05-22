---
tipo: memory
subtipo: reference
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/memory
  - status/active
  - source/manual
ai_summary: Remote git do projeto Berkahn (https://github.com/danielbkfalci00/berkahn). Branch main. PAT vive em .env (gitignored) — NUNCA hardcodar. Credential manager Windows bloqueia push padrão.
status: active
---

# Git Remote — Berkahn

## Remote

- **URL pública**: `https://github.com/danielbkfalci00/berkahn`
- **Branch principal**: `main`
- **Owner**: `danielbkfalci00` (conta do Daniel — co-owner)

## Autenticação

PAT vive em `.env` (gitignored) como `GITHUB_PAT`. **NUNCA hardcodar PAT em arquivos versionados.**

O credential manager do Windows bloqueia `git push` padrão. Usar PAT embutido:
```powershell
git push https://$env:GITHUB_PAT@github.com/danielbkfalci00/berkahn.git main
```

Ou configurar remote uma vez:
```powershell
git remote set-url origin https://$env:GITHUB_PAT@github.com/danielbkfalci00/berkahn.git
```

## .gitignore — o que NÃO commitar

- `scripts/` (todo diretório — scripts de migration com possíveis secrets)
- `.env`, `.env.local`, `.env*.local`
- `.claude/settings.local.json` e `*.backup`
- `.next/` (build cache)
- `public/.optimized/` (assets gerados)

## Histórico de PATs

- 2026-05-21: 2 PATs antigos revogados (vazaram em working tree e `.claude/settings.local.json.backup`). Novo PAT gerado com escopo mínimo (`repo`).

## Referências

- Config Supabase: [[supabase-config]]
- Pipeline blog (usa scripts gitignored): [[blog-pipeline]]
