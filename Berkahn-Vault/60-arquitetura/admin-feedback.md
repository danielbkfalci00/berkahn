---
tipo: documentacao
criado: 2026-09-22
atualizado: 2026-09-22
tags:
  - domain/admin
  - project/site
  - status/active
ai_summary: "Mural de feedback do admin em /admin/feedback: qualquer membro sugere e conversa em formato de chat, só owner (RPC) ou a CLI mudam status aberto/implementado. Migration 034 aplicada e verificada em produção em 2026-09-22, botão flutuante em todas as telas e CLI scripts/admin/feedback.mjs para o Claude operar pelo terminal."
status: active
projeto: site
---

# Feedback e melhorias do admin

> Qualquer pessoa logada no admin manda uma sugestão de melhoria pelo botão **Feedback** no canto da tela, e a conversa continua em `/admin/feedback/[id]`. O proprietário marca o que foi implementado. O Claude lê, responde e fecha itens pela CLI.

Contexto: [[admin-setup]], [[stack-nextjs-supabase]]. Desenho de threads herdado de [[comentarios-inline-documentacoes]].

## Decisões do dono (não mudar sem falar com ele)

- **Mural compartilhado**: todo membro ativo, de qualquer papel, vê todos os feedbacks e responde em qualquer um. `roleCanAccessPath` libera `/admin/feedback` para os quatro papéis.
- **Dois status só**: `aberto` e `implementado`.
- **Quem muda status**: só o papel `owner` (pela UI) e a CLI (service role).

## Desenho

| Peça | Onde |
|---|---|
| Tabelas, RLS, triggers, RPC, push | `supabase/migrations/034_admin_feedback.sql` |
| Tipos e validação pura | `types/feedback.ts` (sem imports, testado por `scripts/analytics/testar-feedback.mjs`) |
| Leituras | `lib/feedback/queries.ts` |
| Escritas | `app/admin/feedback/actions.ts` (`criarFeedback`, `responder`, `definirStatus`) |
| Lista e detalhe | `app/admin/feedback/page.tsx`, `app/admin/feedback/[id]/page.tsx` |
| Botão flutuante + formulário rápido | `components/admin/feedback/FeedbackRapido.tsx`, montado em `AdminLayoutClient` |
| Contador na sidebar | `components/admin/AdminSidebar.tsx` |
| CLI | `scripts/admin/feedback.mjs` |

**Duas tabelas** (`feedback_itens` e `feedback_mensagens`), pelo mesmo motivo da 009: o item é dono do status, a mensagem é dona do texto. A descrição do formulário vira a primeira mensagem.

**Autoria amarrada à sessão.** Um trigger `BEFORE INSERT` sobrescreve `autor_id` com `auth.uid()`, `autor_nome` com o nome do cadastro (ou o e-mail do JWT) e força `origem = 'admin'`. Ninguém consegue forjar o selo "via Claude" nem criar um item já implementado pelo PostgREST. Sem sessão (service role) o trigger não mexe, e é assim que a CLI grava como "Claude".

**Status só pela RPC.** Não existe policy de UPDATE nem de DELETE para `authenticated`. `set_feedback_status(p_id, p_status, p_nota)` é `SECURITY DEFINER`, recusa quem não é owner e grava `activity_logs` com `entity_type = 'feedback'`. O CHECK de `entity_type` foi reescrito a partir da lista da 017, a última que o alterou.

**Push.** Item novo entra na `lead_notification_outbox` como `novo_feedback`, só para owners (`lib/push/dispatch.ts`). O payload é genérico ("Novo feedback no admin") e leva apenas o id dentro da URL: nada de título, texto ou nome, porque a notificação aparece na tela bloqueada.

**Detalhe em página própria, não painel lateral.** No celular o chat precisa da tela inteira e do teclado virtual, e o link direto serve para o push e para a CLI. O botão flutuante some dentro de `/admin/feedback` para não cobrir o composer, e sobe nas telas do wizard de orçamento, que têm barra de ações no rodapé.

**Contador sem custo por navegação.** A sidebar faz um `COUNT` com `head: true` só ao entrar ou sair do mural, ou quando o formulário rápido avisa que criou um item. Mesmo padrão do badge de leads.

**Migration pendente não quebra a tela.** A 034 foi aplicada em 2026-09-22 (tabelas, RPC e CLI conferidas contra o banco). Se um ambiente novo rodar o código antes dela, o PostgREST responde `PGRST205`. A lista e o detalhe mostram um aviso explicando o que aplicar; o badge some; a CLI sai com código 2.

## Como o Claude usa a CLI

```bash
node scripts/admin/feedback.mjs listar                         # abertos
node scripts/admin/feedback.mjs listar --status=todos --json
node scripts/admin/feedback.mjs ver <id>                       # conversa inteira
node scripts/admin/feedback.mjs responder <id> --arquivo=scripts/.cache/resposta.txt --dry-run
node scripts/admin/feedback.mjs status <id> implementado --nota="PR #123" --dry-run
```

- O texto da resposta vem **sempre de arquivo**, nunca do argv (mesmo padrão do `conteudo/pauta.mjs`).
- `--dry-run` em toda escrita; `--json` na leitura.
- Na mudança de status a CLI grava o `activity_logs` ela mesma, porque a RPC exige owner via `auth.uid()` e service role não tem. O `user_id` é o do owner ativo (a CLI age em nome dele) e o `user_name` é "Claude (CLI)".
- Fluxo sugerido: `listar`, `ver`, implementar, abrir PR, `responder` com o que mudou e `status implementado --nota="PR #N"`.

## Pendências

- Aplicar `034_admin_feedback.sql` no SQL Editor do Supabase.
- O CHECK de `activity_logs.entity_type` não tem `'documento'`, embora as policies da 031 o citem. Não foi mexido aqui para não misturar assuntos.
