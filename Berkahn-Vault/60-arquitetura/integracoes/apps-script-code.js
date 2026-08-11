/**
 * Berkahn - Notificação de Leads
 *
 * DESATIVADO em 2026-08-11. Preservado somente como artefato histórico.
 * Não publicar: captura e alertas operacionais agora usam Supabase/Web Push.
 *
 * O Supabase é a fonte operacional e a única custódia de PII. Este Apps Script
 * recebe somente o UUID do lead, mantém um ledger mínimo e envia um aviso com
 * link para o admin autenticado.
 *
 * @version 1.4.0
 * @date 2026-08-10
 */

const CONFIG = {
  SHEET_NAME: 'Notificacoes',
  NOTIFICATION_EMAIL: 'danielbkfalci@gmail.com',
  ADMIN_BASE_URL: 'https://admin.berkahn.com.br/admin/leads',
  SEND_NOTIFICATION: true
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('LEAD_SYNC_SECRET');

    if (!expectedSecret || data.sync_secret !== expectedSecret) {
      return createResponse(false, 'Não autorizado');
    }
    if (!isUuid(data.lead_id)) {
      return createResponse(false, 'lead_id inválido');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const result = saveNotification(data.lead_id);
      if (CONFIG.SEND_NOTIFICATION && result.shouldSend) {
        sendNotificationEmail(data.lead_id);
        markNotificationSent(result.row);
      }

      return createResponse(true, 'Notificação processada', result);
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Erro no doPost:', error);
    return createResponse(false, error.message);
  }
}

function doGet() {
  return createResponse(true, 'API Berkahn funcionando!', {
    timestamp: new Date().toISOString(),
    version: '1.4.0'
  });
}

/**
 * Registra somente metadados de entrega. Retries atualizam a mesma linha.
 */
function saveNotification(leadId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data/Hora', 'Lead ID', 'Status']);
  }

  const timestamp = Utilities.formatDate(
    new Date(),
    'America/Sao_Paulo',
    'dd/MM/yyyy HH:mm:ss'
  );
  let existingRow = 0;
  if (sheet.getLastRow() > 1) {
    const ids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues();
    const index = ids.findIndex((row) => row[0] === leadId);
    existingRow = index >= 0 ? index + 2 : 0;
  }

  if (existingRow) {
    const status = sheet.getRange(existingRow, 3).getDisplayValue();
    if (status === 'enviado') {
      return { row: existingRow, timestamp: timestamp, shouldSend: false };
    }
    sheet.getRange(existingRow, 1, 1, 3).setValues([[timestamp, leadId, 'pendente']]);
  } else {
    sheet.appendRow([timestamp, leadId, 'pendente']);
  }

  return {
    row: existingRow || sheet.getLastRow(),
    timestamp: timestamp,
    shouldSend: true
  };
}

function markNotificationSent(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error('Aba de notificações não encontrada');
  sheet.getRange(row, 3).setValue('enviado');
}

function sendNotificationEmail(leadId) {
  const adminUrl = `${CONFIG.ADMIN_BASE_URL}/${encodeURIComponent(leadId)}`;
  const subject = notificationSubject(leadId);
  // A busca no Sent torna o retry idempotente mesmo se o email tiver sido
  // enviado e a atualização do ledger falhar logo depois.
  if (hasSentNotification(subject)) return;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">BERKAHN</h1>
        <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.7;">Novo contato recebido</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #000; margin-top: 0;">Novo contato recebido</h2>
        <p style="color: #444; line-height: 1.6;">
          Os dados pessoais permanecem exclusivamente no Supabase. Acesse o
          painel autenticado para consultar e tratar o lead.
        </p>
        <div style="margin-top: 30px; padding: 15px; background: #000; text-align: center;">
          <a href="${adminUrl}" style="color: #fff; text-decoration: none; font-size: 14px;">
            Abrir lead no admin
          </a>
        </div>
      </div>
      <div style="padding: 15px; text-align: center; font-size: 11px; color: #999;">
        Enviado automaticamente pelo site Berkahn
      </div>
    </div>
  `;
  const textBody = `Novo lead Berkahn\n\nOs dados pessoais permanecem no Supabase.\nAcesse o admin: ${adminUrl}`;

  GmailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, textBody, {
    htmlBody: htmlBody
  });
}

function notificationSubject(leadId) {
  return `Novo lead Berkahn [${leadId}]`;
}

function hasSentNotification(subject) {
  const escaped = subject.replace(/"/g, '\\"');
  const threads = GmailApp.search(`in:sent subject:"${escaped}"`, 0, 5);
  return threads.some((thread) => thread.getMessages().some((message) =>
    message.getSubject() === subject
  ));
}

function isUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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

function testSaveData() {
  const testLeadId = '11111111-1111-4111-8111-111111111111';
  const result = saveNotification(testLeadId);
  console.log('Notificação registrada:', result);

  // Descomente para testar o email sem PII:
  // sendNotificationEmail(testLeadId);
}
