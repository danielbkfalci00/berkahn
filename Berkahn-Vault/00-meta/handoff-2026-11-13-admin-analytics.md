---
tipo: meta
criado: 2026-11-13
atualizado: 2026-11-13
tags:
  - domain/admin
  - project/site
  - status/active
ai_summary: Handoff da sessão longa de admin, analytics e leads (ago a nov/2026) para a nova conta do Claude Code. O que foi entregue com PR, o que está em produção e verificado, pendências do Bruno, armadilhas de ambiente e próximos passos. Ler antes de continuar qualquer trabalho no admin.
status: active
projeto: site
---

# Handoff — admin, analytics, leads e WhatsApp (ago → nov/2026)

> Escrito na troca de conta do Claude Code. A nova sessão deve ler esta nota,
> depois [[site]], [[admin-setup]], [[admin-feedback]] e [[analytics-calor]].
> Handoff paralelo da frente de conteúdo: `handoff-2026-10-27-claude-code.md`
> (PR #147, ainda aberto no momento desta nota).

## Escopo desta sessão

Admin da Berkahn (`admin.berkahn.com.br`), dashboard de analytics, CRM de
leads, PWA do admin e o botão de WhatsApp do site público. Conteúdo editorial
(pautas, blog, LinkedIn) é outra frente e outro handoff.

## O que foi entregue (tudo em `main` e em produção)

| PR | O quê | Verificado |
|---|---|---|
| #69 | Analytics: coleta deixou de truncar (GSC 20→5000 queries, piso 3 impressões; GA4 50→200 páginas), queries do dashboard estreitadas (168 KB → 0,7 KB), matriz artigo × mês, quadrante de oportunidade de query, mapa de calor de leitura, funil de leads, replay de consentimento do GA4, backfill da cauda | CI, build, banco (24 checagens pós-backfill) |
| #94 | Auditoria do admin: 81 achados, 74 confirmados por 3 céticos cada, aplicados (open redirect pós-login, cookies de sessão, KPIs de leads, WhatsApp com DDI 55, MoM de mês parcial, engagementRate ×100 duplo, push, a11y). Aviso de bloqueio por papel. Painel "Privacidade (LGPD)" no detalhe do lead (só owner) | CI, build |
| #96 | Mural de feedback: botão flutuante em todo o admin, `/admin/feedback` em chat, status aberto/implementado só por owner ou CLI, push para owner, CLI `scripts/admin/feedback.mjs` | CI, CLI contra o banco |
| #120 | WhatsApp: mensagem leva a origem em linguagem natural ("Estava lendo o artigo "…" no site.") em vez de `Origem no site: /slug · whatsapp_flutuante` | Smoke em produção em 2026-11-12, artigo e /residencial |
| #98, #123 | Documentação no vault | vault-validate 0 issues |

PWA do admin abrindo a home: corrigido por outra sessão (`public/admin/manifest.webmanifest` + isenção no `proxy.ts`); confirmado em produção com `start_url: /admin`. Meu PR #93 foi fechado como redundante.

### Migrations aplicadas por esta frente

- **032** LGPD de leads (anonimização completa, relógio de retenção, retenção legal, eliminação a pedido, autoria de `activity_logs` presa a `auth.uid()`)
- **033** índices trigram na busca de leads
- **034** mural de feedback

As três conferidas no banco depois de aplicadas. Migrations mais novas
(`20261105…`, `20261111…`, área de terreno e estágios do pipeline de leads)
são de outra frente.

## Pendências do Bruno (não dependem de código)

- [ ] @bruno Ativar "Secure password change" no Supabase (Authentication > Providers > Email) #pendencia
- [ ] @bruno Remover e reinstalar o atalho do admin no celular #pendencia
- [ ] @bruno Testar o mural de feedback logado no celular e confirmar que o push chega #pendencia

## Pendências técnicas abertas

- Artigo `construir-ou-comprar-pronto-numeros-grande-sp` é o único publicado sem CTA (tarefa editorial)
- Colunas `sheet_sync_*` em `leads` seguem porque `scripts/leads/import-leads-csv.mjs` ainda grava nelas; dropar exige mudar o import antes
- Junho/2026 em `analytics_snapshots` ficou com só 20 queries: o backfill pulou porque o Google reprocessou o período (850 → 883 cliques). Fev e mar também pulados (backfill encolheria)
- Telas logadas novas (painel LGPD, aviso de papel, mural de feedback) nunca foram vistas num navegador por mim: o login bloqueia teste local
- Pages legado: workflow `pages build and deployment` falha em todo merge (`No url found for submodule path 'claude-code-workflows'`). Despublicar o GitHub Pages com conta admin

## Próximos passos sugeridos

1. Fazer o Bruno testar as telas logadas e corrigir o que ele reportar
2. Usar o mural de feedback como fila: `node scripts/admin/feedback.mjs listar`, implementar, responder com `responder --arquivo` e fechar com `status <id> implementado --nota="PR #N"`
3. Medir em dezembro o efeito do CTA e do quadrante de oportunidade (meta: concentração do artigo #1 de 78% para 55%)

## Armadilhas de ambiente (economizam horas)

- **Diretório compartilhado entre sessões.** Outras sessões trocam de branch na pasta principal. Trabalhar sempre em `git worktree add .worktrees/<nome> -b <branch> origin/main`, com `npm ci` dentro (junction de `node_modules` quebra o Turbopack) e `cp ../../.env.local .`
- **`/scripts/` é gitignored**; arquivo novo que precisa ir para o repo exige `git add -f`
- **Aplicar migration em produção é bloqueado para o Claude** pelo classificador. Quem roda é o Bruno, com `node --env-file=.env.local scripts/db/aplicar-migration.mjs <arquivo>`
- **PowerShell `>` grava UTF-16** e o Postgres recusa ("invalid message format"). Extrair arquivo de outro branch com `cmd /c "git show origin/main:<path> > %TEMP%\x.sql"`
- **PostgREST não dá erro quando a RLS filtra a linha**, devolve zero linhas. Toda mutação confere `.select()` vazio
- **`->>` do PostgREST devolve texto**; converter antes de usar como número
- **`manifest.ts` do Next só vale na raiz de `app/`**
- **Número que trava no mesmo valor por meses é teto, não dado** (regra que achou o truncamento do GSC)
- Commit em heredoc no Bash, nunca `@'…'@` (é sintaxe do PowerShell)
- Pastas `.worktrees/admin-audit`, `feedback`, `docs-admin` podem ter ficado travadas pelo Windows; são lixo ignorado pelo git

## Prompt de abertura para a nova conta

> Leia `Berkahn-Vault/00-meta/handoff-2026-11-13-admin-analytics.md` e as
> notas que ela lista. Depois rode `node scripts/admin/feedback.mjs listar`
> e me diga o que está aberto no admin antes de propor qualquer coisa.
