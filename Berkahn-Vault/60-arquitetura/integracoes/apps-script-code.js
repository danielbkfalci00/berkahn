/**
 * Berkahn - Captura de Leads
 * Recebe dados do formulário de contato e salva na planilha
 *
 * Configuração:
 * - Planilha: Captura_Leads_Berkahn (ID: 1C0xAuEPB5KwyR8YhZl0mKf6icxbPd5ec54onkbvm9s0)
 * - Aba: Formulário
 * - Notificação: danielbkfalci@gmail.com
 *
 * Deploy:
 * 1. Extensões → Apps Script (no Google Sheets)
 * 2. Colar este código
 * 3. Salvar como "Berkahn_Leads_API"
 * 4. Implantar → Nova implantação → App da Web
 * 5. Executar como: Eu
 * 6. Quem tem acesso: Qualquer pessoa
 * 7. Copiar URL gerada
 *
 * @version 1.2.0
 * @date 2026-08-07
 * @author Claude Code + Bruno Falci
 */

// ========================================
// CONFIGURAÇÕES
// ========================================

const CONFIG = {
  SHEET_NAME: 'Formulário',
  NOTIFICATION_EMAIL: 'danielbkfalci@gmail.com',
  SEND_NOTIFICATION: true
};

// ========================================
// ENDPOINTS HTTP
// ========================================

/**
 * Processa requisições POST do formulário
 *
 * @param {Object} e - Event object com dados da requisição
 * @returns {TextOutput} Resposta JSON
 */
function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);

    // Autenticação servidor-servidor. Configure LEAD_SYNC_SECRET em
    // Configurações do projeto → Propriedades do script antes do deploy.
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('LEAD_SYNC_SECRET');
    if (!expectedSecret || data.sync_secret !== expectedSecret) {
      return createResponse(false, 'Não autorizado');
    }

    // Validação básica
    if (!data.name || !data.phone || !data.message) {
      return createResponse(false, 'Campos obrigatórios faltando');
    }

    // Salvar na planilha
    const result = saveToSheet(data);

    // Enviar notificação por email
    if (CONFIG.SEND_NOTIFICATION) {
      sendNotificationEmail(data);
    }

    return createResponse(true, 'Dados salvos com sucesso', result);

  } catch (error) {
    console.error('Erro no doPost:', error);
    return createResponse(false, error.message);
  }
}

/**
 * Processa requisições GET (para teste/health check)
 *
 * @param {Object} e - Event object com dados da requisição
 * @returns {TextOutput} Resposta JSON
 */
function doGet(e) {
  return createResponse(true, 'API Berkahn funcionando!', {
    timestamp: new Date().toISOString(),
    version: '1.2.0'
  });
}

// ========================================
// FUNÇÕES DE DADOS
// ========================================

/**
 * Salva os dados na planilha
 *
 * @param {Object} data - Dados do formulário {name, email, phone, message}
 * @returns {Object} Informações da linha inserida {row, timestamp}
 * @throws {Error} Se a aba não for encontrada
 */
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    throw new Error(`Aba "${CONFIG.SHEET_NAME}" não encontrada`);
  }

  // Formatar data/hora no fuso horário do Brasil
  const now = new Date();
  const timestamp = Utilities.formatDate(
    now,
    'America/Sao_Paulo',
    'dd/MM/yyyy HH:mm:ss'
  );

  // Espelho operacional (A-J). lead_id torna retries idempotentes.
  const rowData = [
    timestamp,             // A: Data/Hora
    data.name || '',       // B: Nome
    data.email || '',      // C: Email (opcional)
    data.phone || '',      // D: Telefone
    data.message || '',    // E: Mensagem
    data.lead_id || '',    // F: Lead ID Supabase
    data.segmento || '',   // G: Segmento
    data.origem || '',     // H: Origem
    data.pauta || '',      // I: Pauta
    data.status || 'novo'  // J: Status
  ];

  let existingRow = 0;
  if (data.lead_id && sheet.getLastRow() > 0) {
    const ids = sheet.getRange(1, 6, sheet.getLastRow(), 1).getDisplayValues();
    const index = ids.findIndex((row) => row[0] === data.lead_id);
    existingRow = index >= 0 ? index + 1 : 0;
  }

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  // Retornar informações da linha inserida
  return {
    row: existingRow || sheet.getLastRow(),
    timestamp: timestamp
  };
}

// ========================================
// NOTIFICAÇÕES
// ========================================

/**
 * Envia email de notificação para o administrador
 *
 * @param {Object} data - Dados do lead {name, email, phone, message}
 */
function sendNotificationEmail(data) {
  const safe = {
    name: escapeHtml(data.name || ''),
    email: escapeHtml(data.email || ''),
    phone: escapeHtml(data.phone || ''),
    message: escapeHtml(data.message || '').replace(/\n/g, '<br>')
  };
  const subjectName = String(data.name || '').replace(/[\r\n]+/g, ' ').slice(0, 160);
  const subject = `🏗️ Novo Lead Berkahn: ${subjectName}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">BERKAHN</h1>
        <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.7;">Erguendo o amanhã</p>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #000; margin-top: 0;">Novo Contato Recebido</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nome:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safe.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${data.email ? `<a href="mailto:${safe.email}" style="color: #000;">${safe.email}</a>` : '<span style="color: #999;">Não informado</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${data.phone ? `<a href="tel:${safe.phone}" style="color: #000;">${safe.phone}</a>` : '<span style="color: #999;">Não informado</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mensagem:</td>
            <td style="padding: 10px 0;">${safe.message}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #000; color: #fff; text-align: center;">
          <a href="https://docs.google.com/spreadsheets/d/1C0xAuEPB5KwyR8YhZl0mKf6icxbPd5ec54onkbvm9s0"
             style="color: #fff; text-decoration: none; font-size: 14px;">
            📊 Abrir Planilha de Leads
          </a>
        </div>
      </div>

      <div style="padding: 15px; text-align: center; font-size: 11px; color: #999;">
        Enviado automaticamente pelo formulário do site Berkahn
      </div>
    </div>
  `;

  const textBody = `
Novo Lead Berkahn

Nome: ${data.name}
Email: ${data.email || 'Não informado'}
Telefone: ${data.phone || 'Não informado'}

Mensagem:
${data.message}

---
Acesse a planilha: https://docs.google.com/spreadsheets/d/1C0xAuEPB5KwyR8YhZl0mKf6icxbPd5ec54onkbvm9s0
  `;

  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    // Não interrompe o fluxo se o email falhar
  }
}

// ========================================
// UTILIDADES
// ========================================

/**
 * Cria resposta JSON padronizada
 *
 * @param {boolean} success - Status da operação
 * @param {string} message - Mensagem descritiva
 * @param {Object} data - Dados adicionais (opcional)
 * @returns {TextOutput} Resposta JSON formatada
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };

  if (data) {
    response.data = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// TESTES
// ========================================

/**
 * Função de teste - executar manualmente para testar
 *
 * Como usar:
 * 1. Selecionar "testSaveData" no dropdown de funções
 * 2. Clicar em "Executar"
 * 3. Verificar logs (View → Executions)
 * 4. Verificar se linha foi adicionada na planilha
 * 5. Verificar se email foi recebido
 */
function testSaveData() {
  const testData = {
    name: 'Teste Claude',
    email: 'teste@exemplo.com',
    phone: '(11) 99999-9999',
    message: 'Esta é uma mensagem de teste enviada pelo Claude Code.'
  };

  console.log('=== INICIANDO TESTE ===');

  try {
    const result = saveToSheet(testData);
    console.log('✅ Dados salvos com sucesso:', result);
  } catch (error) {
    console.error('❌ Erro ao salvar dados:', error);
  }

  // Descomente para testar o email também:
  // try {
  //   sendNotificationEmail(testData);
  //   console.log('✅ Email enviado com sucesso');
  // } catch (error) {
  //   console.error('❌ Erro ao enviar email:', error);
  // }

  console.log('=== TESTE FINALIZADO ===');
}
