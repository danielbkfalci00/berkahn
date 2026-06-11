---
tipo: memory
criado: 2026-04-13
atualizado: 2026-05-27
tags:
  - ai/memory
  - status/active
  - source/manual
ai_summary: Remote git do projeto Berkahn (https://github.com/danielbkfalci00/berkahn). Branch main. Bruno (brunofalci00) é collaborator desde 2026-05-27 → push via `gh auth token` + URL x-access-token funciona. PAT antigo na URL do origin (ghp_Eq7I...) expirou.
status: active
subtipo: reference
---

# Git Remote — Berkahn

## Remote

- **URL pública**: `https://github.com/danielbkfalci00/berkahn`
- **Branch principal**: `main`
- **Owner**: `danielbkfalci00` (conta do Daniel)
- **Collaborators**: `brunofalci00` (Bruno, desde 2026-05-27)

## Autenticação

### Método atual (recomendado) — usa `gh` CLI

Bruno está logado no `gh` CLI como `brunofalci00` (collaborator). Token gerenciado pelo keyring do Windows, sem env var em texto puro:

```powershell
$tok = (gh auth token).Trim()
git push "https://x-access-token:$tok@github.com/danielbkfalci00/berkahn.git" main
```

Verificar login com `gh auth status`. Escopos necessários: `repo`, `workflow`.

### PAT antigo na URL do origin (DEPRECATED)

A URL do `origin` ainda tem PAT embutido (`ghp_Eq7I...`) gerado pela conta `danielbkfalci00`. **Expirou em ~2026-05-27** — `git push origin main` retorna `could not read Password` porque o GitHub rejeita o token e o git cai em prompt interativo (que quebra fora de TTY).

Limpeza opcional (remover token expirado da URL — Bruno decide):
```powershell
git remote set-url origin "https://github.com/danielbkfalci00/berkahn.git"
# depois sempre usar o método com gh auth token acima
```

### Métodos legados (não usar)

- `$env:GITHUB_PAT` em `.env` → **não existe** mais no `.env.local` (2026-05-27)
- Credential manager do Windows → continua bloqueando `git push` padrão

## .gitignore — o que NÃO commitar

- `scripts/` (todo diretório — scripts de migration com possíveis secrets)
- `.env`, `.env.local`, `.env*.local`
- `.claude/settings.local.json` e `*.backup`
- `.next/` (build cache)
- `public/.optimized/` (assets gerados)

## Histórico de PATs

- 2026-05-21: 2 PATs antigos revogados (vazaram em working tree e `.claude/settings.local.json.backup`). Novo PAT gerado com escopo mínimo (`repo`).
- 2026-05-27: PAT `ghp_Eq7I...` (embutido na URL do origin) **expirou ou foi revogado** silenciosamente. Bruno foi adicionado como collaborator no repo `danielbkfalci00/berkahn`; auth migrada para token gerenciado pelo `gh` CLI da conta `brunofalci00`.

## Referências

- Config Supabase: [[supabase-config]]
- Pipeline blog (usa scripts gitignored): [[blog-pipeline]]
