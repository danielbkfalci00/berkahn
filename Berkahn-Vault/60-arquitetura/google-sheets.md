---
tipo: context
criado: 2025-12-16
atualizado: 2026-05-21
tags:
  - ai/context
  - project/site
  - domain/integrations
ai_summary: Integração formulário de contato Berkahn → Google Sheets via Apps Script. Captura leads do site (POST /exec) e gravar em planilha + notifica email. Sheet ID em .env (gitignored).
status: active
escopo: berkahn
secrets_redacted: 2026-05-21
---

# Integração Formulário de Contato → Google Sheets

> [!info] Migração para vault
> Migrado de `Docs/integracoes/INTEGRACAO_GOOGLE_SHEETS.md`. Sanitizado: Sheet ID e email removidos. Apps Script code mantido em `scripts/` (gitignored). Ver [[stack-nextjs-supabase]] para visão geral.

**Status**: ✅ Implementado
**Data**: 2025-12-16
**Autor**: Claude Code + Bruno Falci

---

## 📋 Visão Geral

Sistema de captura de leads do formulário de contato do site Berkahn integrado com Google Sheets via Google Apps Script. Inclui notificações automáticas por email.

### Fluxo de Dados

```
┌─────────────────┐
│  Site Berkahn   │
│  (Next.js)      │
└────────┬────────┘
         │
         │ POST /exec
         │ {name, email, phone, message}
         │
         ▼
┌─────────────────┐
│  Apps Script    │
│  (Web App)      │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────┐    ┌──────────────┐
│ Google      │    │ Gmail        │
│ Sheets      │    │ (Notify)     │
└─────────────┘    └──────────────┘
```

---

## 🔧 Configuração

### 1. Planilha Google Sheets

**ID da Planilha**: `{{GOOGLE_SHEETS_ID}}` (valor real em `.env` → `GOOGLE_SHEETS_ID`)
**Nome**: Captura_Leads_Berkahn
**Aba**: Formulário
**URL**: `https://docs.google.com/spreadsheets/d/{{GOOGLE_SHEETS_ID}}`

#### Estrutura das Colunas

| Coluna | Campo       | Tipo      | Obrigatório | Formato                  |
|--------|-------------|-----------|-------------|--------------------------|
| A      | Data/Hora   | Timestamp | Sim         | `dd/MM/yyyy HH:mm:ss`    |
| B      | Nome        | String    | Sim         | Texto livre              |
| C      | Email       | String    | Sim         | Validado com regex       |
| D      | Telefone    | String    | Não         | `(00) 00000-0000`        |
| E      | Mensagem    | String    | Sim         | Texto livre (multiline)  |

### 2. Apps Script (Servidor)

**Localização**: Extensões → Apps Script (na planilha)
**Nome do Projeto**: Berkahn_Leads_API
**Código**: Ver `apps-script-code.js` neste diretório

#### Configurações do Deployment

```javascript
CONFIG = {
  SHEET_NAME: 'Formulário',
  NOTIFICATION_EMAIL: '{{NOTIFICATION_EMAIL}}',
  SEND_NOTIFICATION: true
}
```

**Deploy Settings**:
- Tipo: Web App
- Executar como: Eu (sua conta Google)
- Quem tem acesso: Qualquer pessoa
- URL gerada: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`

### 3. Frontend (Next.js)

**Arquivo**: `components/forms/ContactFormDialog.tsx`
**Função modificada**: `handleSubmit()` (linhas 61-73)

---

## 🔌 API Endpoints

### POST /exec

Recebe dados do formulário e salva na planilha.

**Request Headers**:
```
Content-Type: text/plain
```

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 99999-9999",
  "message": "Gostaria de um orçamento para construção..."
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Dados salvos com sucesso",
  "timestamp": "2025-12-16T14:30:00.000Z",
  "data": {
    "row": 15,
    "timestamp": "16/12/2025 14:30:00"
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Campos obrigatórios faltando",
  "timestamp": "2025-12-16T14:30:00.000Z"
}
```

### GET /exec

Health check endpoint para testar se a API está funcionando.

**Response (200)**:
```json
{
  "success": true,
  "message": "API Berkahn funcionando!",
  "timestamp": "2025-12-16T14:30:00.000Z",
  "data": {
    "timestamp": "2025-12-16T14:30:00.000Z",
    "version": "1.0.0"
  }
}
```

---

## ✉️ Notificações por Email

### Template HTML

Email enviado automaticamente para `danielbkfalci@gmail.com` a cada novo lead.

**Subject**: `🏗️ Novo Lead Berkahn: {Nome do Cliente}`

**Conteúdo**:
- Header preto com logo BERKAHN
- Tabela com dados do lead
- Link direto para abrir a planilha
- Design responsivo e profissional

**Envio**:
- Função: `sendNotificationEmail(data)`
- API: `MailApp.sendEmail()`
- Fallback: Se falhar, não interrompe o fluxo (lead ainda é salvo)

---

## 🧪 Testes

### 1. Teste Manual do Apps Script

Execute no Editor de Scripts:

```javascript
testSaveData()
```

**Resultado esperado**:
- ✅ Nova linha adicionada na aba "Formulário"
- ✅ Email recebido em danielbkfalci@gmail.com
- ✅ Console.log mostra: `{ row: N, timestamp: "..." }`

### 2. Teste via Frontend (Local)

```bash
npm run dev
```

1. Abrir http://localhost:3000
2. Clicar em "FALE CONOSCO"
3. Preencher formulário:
   - Nome: Teste Local
   - Email: teste@example.com
   - Telefone: (11) 99999-9999
   - Mensagem: Teste de integração
4. Clicar em "Enviar Mensagem"

**Resultado esperado**:
- ✅ Spinner de loading aparece
- ✅ Dialog mostra "Mensagem Enviada!"
- ✅ Dados aparecem na planilha
- ✅ Email de notificação recebido

### 3. Teste de Erros

**Teste A: Campos vazios**
- Ação: Enviar formulário com campos vazios
- Esperado: Mensagens de validação no frontend

**Teste B: Email inválido**
- Ação: Digitar email sem @ ou domínio
- Esperado: "Email inválido"

**Teste C: URL incorreta**
- Ação: Modificar URL do Apps Script para URL inexistente
- Esperado: "Erro de conexão. Tente novamente."

---

## 🛠️ Troubleshooting

### Problema: "Campos obrigatórios faltando"

**Causa**: Frontend não está enviando todos os campos obrigatórios (name, email, message)

**Solução**:
1. Verificar se `ContactFormDialog.tsx` está enviando os 3 campos
2. Verificar se `validateForm()` está permitindo envio
3. Inspecionar payload no Network tab (DevTools)

---

### Problema: "Aba 'Formulário' não encontrada"

**Causa**: Nome da aba no Sheets não corresponde ao CONFIG.SHEET_NAME

**Solução**:
1. Abrir planilha e verificar nome exato da aba
2. Modificar `CONFIG.SHEET_NAME` no Apps Script se necessário
3. Fazer redeploy da Web App

---

### Problema: Email não está sendo enviado

**Causa 1**: Flag `SEND_NOTIFICATION` está false
**Solução**: Alterar `CONFIG.SEND_NOTIFICATION = true`

**Causa 2**: Email do destinatário está incorreto
**Solução**: Verificar `CONFIG.NOTIFICATION_EMAIL`

**Causa 3**: Permissões do Apps Script
**Solução**: Reautorizar permissões (Gmail.send)

---

### Problema: CORS Error no frontend

**Causa**: Apps Script não aceita JSON direto em requisições POST

**Solução**: Usar `Content-Type: text/plain` (já implementado)

```typescript
headers: {
  'Content-Type': 'text/plain', // ✅ Correto
  // 'Content-Type': 'application/json', // ❌ Causa CORS
}
```

---

### Problema: Dialog mostra "Erro de conexão"

**Possíveis causas**:
1. URL do Apps Script incorreta
2. Deploy não está público ("Qualquer pessoa")
3. Rede bloqueando script.google.com

**Solução**:
1. Verificar URL em `ContactFormDialog.tsx`
2. Refazer deploy com acesso "Qualquer pessoa"
3. Testar URL diretamente no navegador (GET /exec)
4. Verificar Console do navegador para erro específico

---

## 🔒 Segurança

### Validações Implementadas

**Frontend** (`ContactFormDialog.tsx`):
- Nome: não vazio
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Mensagem: não vazia
- Telefone: opcional (sem validação)

**Backend** (Apps Script):
- Verifica presença de `name`, `email`, `message`
- Retorna erro 400 se campos obrigatórios faltarem

### Considerações

⚠️ **Limitações de Segurança**:
- Apps Script com acesso "Qualquer pessoa" pode receber spam
- Não há rate limiting nativo
- Não há verificação de CAPTCHA

🛡️ **Melhorias Futuras**:
- Implementar Google reCAPTCHA v3
- Adicionar rate limiting (Apps Script Properties)
- Adicionar honeypot field (campo invisível anti-bot)

---

## 📊 Monitoramento

### KPIs Importantes

1. **Taxa de conversão de formulário**
   - Métrica: Envios bem-sucedidos / Visualizações do dialog
   - Ferramenta: Google Analytics (a implementar)

2. **Tempo de resposta do Apps Script**
   - Métrica: Duração do POST /exec
   - Ferramenta: Apps Script Logs (View → Executions)

3. **Taxa de erro**
   - Métrica: Erros / Total de tentativas
   - Ferramenta: Browser Console + Apps Script Logs

### Logs do Apps Script

Acessar: Apps Script Editor → View → Executions

**Eventos registrados**:
- Cada execução de `doPost()` ou `doGet()`
- Erros com stack trace
- Duração da execução
- Dados enviados (disponíveis em `console.log`)

---

## 🚀 Deploy Checklist

### Pré-Deploy

- [x] Apps Script criado e testado
- [x] Web App deployed com acesso público
- [x] Teste manual com `testSaveData()` passou
- [x] Email de notificação recebido
- [ ] URL da Web App copiada
- [ ] URL adicionada em `ContactFormDialog.tsx`

### Deploy do Frontend

```bash
# 1. Adicionar URL no código
# Editar: components/forms/ContactFormDialog.tsx
# Linha ~67: Substituir 'URL_DA_WEB_APP_AQUI'

# 2. Testar localmente
npm run dev

# 3. Build de produção
npm run build

# 4. Commit
git add components/forms/ContactFormDialog.tsx
git commit -m "feat: Integra formulário com Google Sheets via Apps Script"

# 5. Deploy (Vercel)
git push origin main
```

### Pós-Deploy

- [ ] Testar formulário em produção (berkahn.vercel.app)
- [ ] Verificar se dados aparecem na planilha
- [ ] Verificar se email é recebido
- [ ] Testar em mobile (responsividade)
- [ ] Verificar Console para erros JavaScript

---

## 📝 Changelog

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
- Gmail API (MailApp)
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
