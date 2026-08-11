---
tipo: context
criado: 2025-12-16
atualizado: 2026-08-11
tags:
  - ai/context
  - project/site
  - domain/integrations
ai_summary: Integração Google Sheets/Apps Script desativada em 11/08/2026. Supabase é a única fonte operacional de leads; alertas opcionais usam Web Push sem PII. O restante da nota é histórico e não deve ser usado como runbook.
status: archived
secrets_redacted: 2026-05-21
escopo: berkahn
---

# Google Sheets e Apps Script — legado desativado

> [!warning] Não configurar nem redeployar
> Decisão de 11/08/2026: captura, operação e aprendizado ficam no Supabase.
> O código e as instruções abaixo são preservados somente para rastreabilidade.

> [!info] Migração para vault
> Migrado de `Docs/integracoes/INTEGRACAO_GOOGLE_SHEETS.md`. Sanitizado: Sheet ID e email removidos. Apps Script code mantido em `scripts/` (gitignored). Ver [[stack-nextjs-supabase]] para visão geral.

**Status**: desativado; nenhum deploy pendente
**Data**: 2025-12-16
**Autor**: Claude Code + Bruno Falci

---

## 📋 Visão Geral

O navegador envia o formulário para POST /api/leads. A rota valida o payload, aplica honeypot e limite por fingerprint e grava na tabela `leads` do Supabase. Nenhum Apps Script é chamado.

Fluxo atual:

Site → POST /api/leads → Supabase (fonte única de leads e PII)
                         → Web Push opcional, sem PII

## 🔧 Configuração

### Planilha Google Sheets

A aba `Notificacoes` mantém apenas data/hora, `lead_id` e estado da entrega. A aba é criada automaticamente. Nenhuma PII nova é gravada no Google Sheets.

### Apps Script

- Código versionado: Berkahn-Vault/60-arquitetura/integracoes/apps-script-code.js.
- Tipo: Web App, executado pela conta proprietária.
- Acesso da implantação: Qualquer pessoa; a autorização real ocorre no payload servidor-servidor.
- Script Property obrigatória: LEAD_SYNC_SECRET.
- O segredo nunca deve ser registrado em log, email ou planilha.

### Next.js e Vercel

- Formulário compartilhado: components/forms/ContactForm.tsx.
- Endpoint público: app/api/leads/route.ts.
- Retry autenticado: app/admin/leads/actions.ts.
- Variáveis server-side: GOOGLE_SHEETS_LEAD_ENDPOINT e GOOGLE_SHEETS_LEAD_SECRET.
- Nunca usar prefixo NEXT_PUBLIC_ para endpoint ou segredo.

## 🔌 Endpoints

### POST /api/leads

Endpoint consumido pelo navegador. Valida os dados, grava no Supabase e responde com o lead recebido. A notificação é best-effort e pode ser refeita pelo admin.

### POST /exec

Endpoint privado por segredo compartilhado, chamado somente pelo backend. O contrato final contém apenas `lead_id` e `sync_secret`; dados de contato e atribuição não saem do Supabase. Requisição sem segredo ou UUID válido retorna `success: false`.

### GET /exec

Health check do Apps Script. Não revela configuração nem segredos.
## ✉️ Notificações por Email

### Template HTML

Email enviado automaticamente para `danielbkfalci@gmail.com` a cada novo lead.

**Subject**: `Novo lead Berkahn [lead_id]`

**Conteúdo**:
- Header BERKAHN
- Nenhum dado pessoal
- Link direto para o lead no admin autenticado

**Envio**:
- Função: `sendNotificationEmail(leadId)`
- API: `GmailApp.sendEmail()`
- Idempotência: antes de enviar, o script procura o subject exato em `in:sent`; isso cobre a falha entre envio concluído e gravação de `enviado` no ledger.
- Fallback: Se falhar, não interrompe o fluxo (lead ainda é salvo)

---

## 🧪 Testes

### Local

1. Executar npm run build e iniciar o preview de produção.
2. Enviar um formulário válido e confirmar resposta de /api/leads.
3. Confirmar o registro na tabela leads do Supabase.
4. Com endpoint e segredo configurados, confirmar sheet_synced_at e a linha na planilha.
5. Testar nome, email e mensagem inválidos, honeypot e envio rápido demais.
6. Validar generate_lead apenas após sucesso; não enviar PII ao GA4.

### Rollout do Apps Script 1.4

1. Gerar um segredo aleatório.
2. Configurar GOOGLE_SHEETS_LEAD_SECRET na Vercel.
3. Configurar o mesmo valor em Apps Script → Project Settings → Script Properties → LEAD_SYNC_SECRET.
4. Colar a versão atual de apps-script-code.js e criar nova implantação.
5. Testar POST sem segredo, que deve falhar.
6. Testar POST autenticado pelo backend e retry pelo admin.
7. Forçar retry depois de um envio e confirmar um único email pelo subject exato; validar ausência de PII no ledger e no corpo.

## 🛠️ Troubleshooting

### Lead existe no Supabase, mas a notificação falhou

- Conferir GOOGLE_SHEETS_LEAD_ENDPOINT e GOOGLE_SHEETS_LEAD_SECRET no ambiente server-side.
- Conferir LEAD_SYNC_SECRET nas Script Properties.
- Confirmar que a nova implantação aponta para a versão 1.4.
- Usar o retry autenticado no admin e consultar Apps Script → Executions.

### Erro de autenticação do espelho

Endpoint e Script Property precisam conter exatamente o mesmo segredo. Não corrigir tornando o segredo público nem removendo a validação.

### Email não enviado

Conferir NOTIFICATION_EMAIL, SEND_NOTIFICATION, quota e permissões do GmailApp. A primeira publicação da v1.4 pode exigir nova autorização OAuth pela troca de `MailApp` para busca/envio via Gmail. A falha de email não deve apagar a linha nem alterar o lead primário.

### Limite de requisições

O limitador atual é best-effort e não atômico. Se houver rajadas ou abuso, migrar a decisão para RPC transacional; não ampliar complexidade sem evidência de volume.
## 🔒 Segurança

### Controles implementados

- O navegador envia leads somente para `POST /api/leads`; a URL do Apps Script não é pública no bundle.
- Supabase é a fonte primária, com validação server-side, honeypot, tempo mínimo e limite por fingerprint.
- O Apps Script 1.4 é apenas adaptador de notificação e exige `sync_secret` igual à Script Property `LEAD_SYNC_SECRET`.
- O backend usa `GOOGLE_SHEETS_LEAD_SECRET`; nunca usar prefixo `NEXT_PUBLIC_` nem registrar o valor.
- O ledger é idempotente por `lead_id`. O email também é conferido em `in:sent` pelo subject técnico antes de um retry; isso evita duplicidade quando o envio conclui, mas a escrita de `enviado` falha.
- PII permanece exclusivamente no Supabase; GA4 recebe somente dimensões de atribuição.

### Risco residual

O limitador do endpoint Next.js usa contagem seguida de insert, portanto não é atômico contra rajadas paralelas. Corrigir exigiria RPC/migration própria; acompanhar volume antes de ampliar o escopo. CAPTCHA continua dispensável enquanto honeypot, segredo e volume forem suficientes.

### Rollout 1.4

1. Gerar segredo aleatório e configurar `GOOGLE_SHEETS_LEAD_SECRET` na Vercel.
2. Configurar o mesmo valor em Apps Script → Project Settings → Script Properties → `LEAD_SYNC_SECRET`.
3. Colar `integracoes/apps-script-code.js`, criar nova implantação e manter acesso “Qualquer pessoa” somente porque a autenticação ocorre no payload servidor-servidor.
4. Testar POST sem segredo (deve falhar) e retry autenticado pelo admin (deve notificar).
5. Rotacionar o segredo se a URL ou o payload forem expostos.

---
## 📊 Monitoramento

- Contatos recebidos: generate_lead.
- Intenção via WhatsApp: whatsapp_click.
- Qualificação: estados canônicos em `/admin/leads`; nunca inferir qualificação a partir do clique.
- Saúde da notificação: sheet_synced_at, erros de retry e Apps Script → Executions.
- Não registrar PII em GA4 ou logs.

## 🚀 Deploy Checklist 1.4

### Código

- [x] Supabase como fonte primária.
- [x] Ledger mínimo idempotente por lead_id.
- [x] Apps Script exige segredo e não recebe PII no contrato final.
- [x] Backend e retry enviam o segredo server-side.
- [x] Build, typecheck e revisão de segurança concluídos.

### Configuração externa

- [x] Apps Script removido do caminho operacional em 11/08/2026
- [ ] @bruno Apagar, quando houver acesso, PII histórica da planilha e emails legados conforme a política de retenção; isso não bloqueia o CRM Supabase #pendencia
## 📝 Changelog

### v1.4.0 — 2026-08-10

- Retry do email passa a consultar o subject técnico em Gmail Enviados antes de chamar `sendEmail`.
- Fecha a janela de duplicidade “email enviado, gravação do ledger falhou”.
- A publicação exige autorizar o escopo Gmail da conta proprietária.

### v1.3.1 — 2026-08-10

- Supabase passa a ser a única custódia de PII.
- Apps Script recebe apenas `lead_id` e segredo.
- Planilha vira ledger mínimo; email aponta para o admin sem expor dados pessoais.
- Lock e estado `pendente`/`enviado` tornam o ledger idempotente; a idempotência do email foi completada na v1.4.

### v1.2.0 — 2026-08-07

- Supabase consolidado como fonte primária; esta versão foi substituída pelo ledger mínimo sem PII da v1.3.
- Segredo obrigatório entre Next.js e Apps Script.
- HTML de email escapado e assunto protegido contra quebra de linha.
- Dimensões opcionais de atribuição documentadas sem PII no GA4.
- Runbook substituído pelo fluxo atual; instruções antigas de fetch direto do navegador foram removidas.

### v1.0.0 - 2025-12-16

**Adicionado**:
- Integração completa com Google Sheets
- Apps Script com funções `doPost()`, `saveToSheet()`, `sendNotificationEmail()`
- Email HTML com template branded Berkahn
- Documentação completa da integração
- Tratamento de erros no frontend

**Modificado**:
- `ContactFormDialog.tsx`: Substituído mock `setTimeout` por fetch real

**Tecnologias**:
- Google Apps Script (JavaScript server-side)
- Google Sheets API
- GmailApp (envio + consulta idempotente em Enviados)
- Next.js 14+ (App Router)
- TypeScript

---

## 🔗 Links Úteis

- **Planilha**: https://docs.google.com/spreadsheets/d/1C0xAuEPB5KwyR8YhZl0mKf6icxbPd5ec54onkbvm9s0
- **Apps Script Docs**: https://developers.google.com/apps-script
- **Apps Script Reference**: https://developers.google.com/apps-script/reference
- **Web Apps Guide**: https://developers.google.com/apps-script/guides/web

---

## 👤 Contato

**Desenvolvedor**: Bruno Falci
**Email**: danielbkfalci@gmail.com
**Projeto**: Site Berkahn
**Repositório**: danielbkfalci00/berkahn
