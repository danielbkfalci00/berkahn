---
tipo: documentacao
criado: 2026-05-22
atualizado: 2026-08-06
tags:
  - project/site
  - status/active
ai_summary: README dos scripts operacionais do vault e conteúdo. Inclui backfills, resync, imagens e o CLI genérico pauta.mjs, com dry-run, confirmações, idempotência e segurança.
status: active
---

# Vault Scripts — Sprint 2 (Reorganização Berkahn)

Scripts criados durante Sprint 2 da reorganização do vault. Documentação de uso, idempotência e segurança.

## Scripts disponíveis

### 1. `vault-backfill-articles.mjs` — Sprint 2.1 estrutural

Normaliza frontmatter (FLAT, ordem canônica do linter) dos 32 artigos em `Berkahn-Vault/40-content/blog/publicados/`. Detecta 2 padrões (com/sem YAML), preserva campos existentes, adiciona faltantes (`tipo`, `tags`, `projeto`, `slug`, `data_publicacao`, `seo_title`, `url_final`, etc).

```bash
# Dry-run (mostra o que mudaria):
node scripts/vault-backfill-articles.mjs --dry-run

# Aplicar frontmatter (sem rename):
node scripts/vault-backfill-articles.mjs

# Aplicar + renomear filename para slug canonical:
node scripts/vault-backfill-articles.mjs --rename
```

**Idempotente**: rerodar não duplica nem sobrescreve campos existentes. SLUG_MAP define mapping filename atual → slug canonical (validado contra `scripts/run-sprint4.mjs` PARTE 2).

**Já rodado em Sprint 2.1** — 32 artigos processados.

### 2. `vault-backfill-ai-summary.mjs` — Sprint 2.1B semântico

Preenche `ai_summary` (de `description` existente ou lead extraído) e adiciona rodapé padrão com wikilinks para contextos + atomic notes mapeadas por slug.

```bash
node scripts/vault-backfill-ai-summary.mjs --dry-run
node scripts/vault-backfill-ai-summary.mjs
```

**Idempotente**: detecta rodapé existente via marker `<!-- vault-rodape-v1 -->`, não duplica.

**Já rodado em Sprint 2.1B** — 32 artigos processados.

### 3. `vault-supabase-resync.mjs` — Sprint 2.5 sync com produção

Compara slugs vault ↔ Supabase (mode `--check`) ou faz PATCH dos campos `meta_title`, `meta_description`, `answer_summary` dos slugs especificados (mode `--patch=`).

**Requer**: variável de ambiente `SUPABASE_SERVICE_KEY`.

```powershell
# PowerShell — configurar env var (extrair da scripts/run-sprint4.mjs linha 2):
$env:SUPABASE_SERVICE_KEY = "<KEY>"

# Check (só GET, lista matches e mismatches):
node scripts/vault-supabase-resync.mjs --check

# PATCH smoke test (2-3 artigos, dry-run primeiro):
node scripts/vault-supabase-resync.mjs --patch=fissuras-steel-frame,quanto-custa-construir-steel-frame-precos-m2-2026 --dry-run
node scripts/vault-supabase-resync.mjs --patch=fissuras-steel-frame,quanto-custa-construir-steel-frame-precos-m2-2026
```

**⚠️ PATCH afeta produção**. Sempre rodar com `--dry-run` primeiro. Validar URLs em https://www.berkahn.com.br/atualidades/[slug] após PATCH.

**Status**: script criado, **pendente execução manual** (requer env var setada).

### 4. `conteudo/pauta.mjs` — quadro operacional de conteúdo

CLI genérico versionado que substitui os scripts descartáveis `add-article-[slug].mjs`. Lê e altera `conteudo_pautas`, cria/atualiza posts como draft, prepara a capa WebP e publica artigo+pauta por RPC idempotente.

```powershell
# Descoberta e leitura
node scripts/conteudo/pauta.mjs buscar "tema"
node scripts/conteudo/pauta.mjs ver <id>

# Toda escrita começa em dry-run
node scripts/conteudo/pauta.mjs registrar-draft <id> --path="Berkahn-Vault/40-content/blog/drafts/slug.md" --dry-run
node scripts/conteudo/pauta.mjs produzir <id> --dados="post.json" --dry-run
node scripts/conteudo/pauta.mjs publicar <id> --dry-run
```

`criar` exige `--confirmar-aprovacao`. Sobrescrever conteúdo exige `--forcar --confirmar-substituicao`. `publicar` recusa pautas não aprovadas e desfaz a movimentação local do markdown se o banco falhar. Requer `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_KEY` no ambiente para operações remotas.

### 5. `analytics/` — relatório e aprendizado editorial

O pipeline operacional de GA4/GSC é versionado seletivamente. Além do relatório
mensal, ele grava snapshots agregados de 28 dias e cria somente recomendações
pendentes. Não envia PII para analytics nem altera artigos.

```bash
npm run test:analytics
npm run analytics:report
npm run analytics:learning
```

O modo de aprendizado exige as custom dimensions de evento `article_slug` e
`percent_scrolled` no GA4. Sem elas, o relatório continua e marca profundidade
como indisponível.

## Segurança

- Todos os scripts usam `process.env.SUPABASE_SERVICE_KEY` (não hardcoded). Allowlist `.gitleaks.toml` cobre `process.env.[A-Z_]+`.
- `vault-backfill-*.mjs` operam apenas em arquivos locais (sem network).
- `vault-supabase-resync.mjs` faz HTTPS para Supabase REST com Authorization header.
- `conteudo/pauta.mjs` usa a service role somente no processo local/server-side e registra eventos de automação com `user_id = NULL`.
- Nenhum script tem fallback para hardcoded key.

### 5. `vault-images.mjs` — Banco de Imagens (2026-07)

Gerencia o banco de imagens consolidado em `Docs/banco-imagens/` (9 categorias, ~160 arquivos). Fonte de verdade fora do vault; catálogo em `Berkahn-Vault/40-content/materiais/` (MOC `banco-imagens.md` + 9 `indices-*.md` + galerias). `public/images/` (produção Next.js) **nunca** é modificado — só lido para cruzar `em_producao` por sha256.

```bash
# Manifesto completo (path, dims, bytes, sha256, em_producao, producao_paths) -> banco-inventory.json
node scripts/vault-images.mjs --inventory
node scripts/vault-images.mjs --inventory --root=banco-imagens   # categoria = subpasta de banco-imagens/

# Duplicatas exatas (sha256) + pares PNG/WEBP
node scripts/vault-images.mjs --dupes

# Conferir arquivos_total dos índices vs realidade (exit 2 se divergir) — rodar no /standup, /wrap-up
node scripts/vault-images.mjs --check

# Gerar thumbnails webp (400px) de uma lista para uma pasta (camada visual)
node scripts/vault-images.mjs --thumbs --list=<arquivo.txt> --outdir=<dir> --width=400
```

**Dependência**: `sharp` (já no `package.json`) para dimensões e thumbnails. **Read-only** exceto `--thumbs`. Log de-para da migração inicial em `Docs/banco-imagens/_migracao-log.json`.

### 6. `watermark-images.mjs` — Marca d'agua BERKAHN (2026-07)

Aplica marca d'agua "BERKAHN" (wordmark) em lote sobre imagens. Isola so "BERKAHN" (sem tagline) do logo-texto `Docs/banco-imagens/marca/escrito-preto-logo-png.png` via projecao de alpha por linha, recoloriza (branco/preto adaptativo pela regiao central) com opacidade baixa, posiciona grande e centralizado. Preserva orientacao EXIF e os originais (escreve so em `--out`).

```bash
# Lote (acabamento aprovado no projeto Clube Quinta dos Lagos):
node scripts/watermark-images.mjs --src="C:/Users/bruno/Downloads/Arquitetura/Arquitetura" --no-halo --opacity=0.15

# Mais presente em todas (ainda discreto):
node scripts/watermark-images.mjs --src="<dir>" --no-halo --opacity=0.25

# Preview antes do lote:
node scripts/watermark-images.mjs --src="<dir>" --pick="a.jpeg,b.jpeg" --out="<dir>/_preview"
```

Flags: `--src` `--out` (default `<src>/com-marca-dagua`) `--logo` `--frac=0.58` `--opacity=0.15` `--color=auto|white|black` `--halo` `--halo-opacity=0.55` `--pick=a,b` `--limit=N` `--dry-run`. **Dependencia**: `sharp`. Read-only nos originais. Doc da entrega: `Berkahn-Vault/40-content/materiais/watermark-clube-quinta-dos-lagos.md`.

## Tech debt verificado

A varredura de 405 arquivos encontrou zero JWT Supabase e zero `sb_secret_`
hardcoded. Scripts históricos continuam fora do deploy; apenas os CLIs
operacionais seguros são versionados.

## Estado pós-Sprint 2

- **Vault**: 32 artigos com frontmatter normalizado + ai_summary + rodapé com wikilinks
- **Atomic notes**: 10 criadas em `Berkahn-Vault/70-knowledge/` (lsf-normas-nbr, lsf-custos, etc)
- **Templates**: `template-atomic` e `template-draft-blog` com auto-link
- **Bidirecional**: 1 post LinkedIn ↔ artigo (medstar/hospital), capas mapeadas em [[indices-capas-blog]]
- **Pendente**: smoke test Supabase (precisa env var) + validar `/artigo` em novo draft

## Próximos passos (Sprint 3)

1. 4 bases novas em `Berkahn-Vault/80-bases/`: `projetos.base`, `kpis.base`, `conhecimento.base`, `materiais.base`
2. MOC update com seção "Projetos Ativos"
3. CLAUDE.md (projeto + vault) com novas regras
4. `scripts/vault-validate.sh` linter de completude
