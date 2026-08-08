// One-time OAuth flow para gerar refresh_token usando OAuth Client do projeto berkahn-analytics
// Bypassa o bug GA4 SA novos + bug do gcloud SDK não respeitar test users do consent screen
//
// Usage: node scripts/analytics/oauth-login.mjs
//
// 1. Lê secrets/oauth-client.json (criado no console.cloud.google.com)
// 2. Imprime URL para autorizar (você clica e autoriza no browser)
// 3. Captura código via HTTP local em http://localhost:8765/oauth-callback
// 4. Troca por refresh_token
// 5. Salva em secrets/oauth-tokens.json (gitignored)

import { google } from 'googleapis';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const CLIENT_PATH = path.resolve('./secrets/oauth-client.json');
const TOKENS_PATH = path.resolve('./secrets/oauth-tokens.json');

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

async function main() {
  if (!fs.existsSync(CLIENT_PATH)) {
    console.error(`❌ OAuth client JSON não encontrado em ${CLIENT_PATH}`);
    console.error('Crie em console.cloud.google.com → APIs & Services → Credentials → + Create OAuth client ID → Desktop app');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CLIENT_PATH, 'utf-8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;

  const port = 8765;
  const redirectUri = `http://localhost:${port}/oauth-callback`;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  console.log('\n========================================================');
  console.log('🌐 Abra esta URL no browser para autorizar:');
  console.log('========================================================');
  console.log(authUrl);
  console.log('========================================================\n');
  console.log('Aguardando autorização... (timeout em 5 min)');
  console.log('Quando a tela "Berkahn Analytics CLI quer acessar..." aparecer:');
  console.log('  1. Clica em "Avançado" (canto inferior esquerdo)');
  console.log('  2. Clica em "Acessar berkahn-analytics CLI (não seguro)"');
  console.log('  3. Marca os 2 scopes e clica "Continuar"\n');

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, `http://localhost:${port}`);
        if (url.pathname !== '/oauth-callback') {
          res.writeHead(404).end();
          return;
        }
        const params = url.searchParams;
        const error = params.get('error');
        const codeParam = params.get('code');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' }).end(
            `<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h1 style="color:#B83A3A">Erro</h1><p>${error}</p></body></html>`
          );
          reject(new Error(`OAuth error: ${error}`));
          server.close();
          return;
        }

        if (!codeParam) {
          res.writeHead(400).end('Missing code');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(
          `<html><body style="font-family:Manrope,sans-serif;text-align:center;padding:80px;background:#F4F2EC">
            <h1 style="color:#0A0A0A;letter-spacing:-0.02em">✅ Autorizado com sucesso</h1>
            <p style="color:#4A4A4A;font-size:16px">Você pode fechar esta aba e voltar para o terminal.</p>
            <p style="color:#8A8A8A;font-size:13px;margin-top:32px">Berkahn Analytics</p>
          </body></html>`
        );
        resolve(codeParam);
        setTimeout(() => server.close(), 500);
      } catch (e) {
        reject(e);
      }
    });

    server.listen(port);
    server.on('error', reject);
    setTimeout(() => {
      reject(new Error('Timeout: nenhuma autorização recebida em 5 minutos'));
      server.close();
    }, 5 * 60 * 1000);
  });

  console.log('🔑 Trocando código por tokens...');
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    console.error('❌ refresh_token não retornado. Pode ser que você já tenha autorizado antes.');
    console.error('   Solução: revoque o acesso em myaccount.google.com/permissions e rode de novo.');
    process.exit(1);
  }

  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
  console.log(`✅ Tokens salvos em ${TOKENS_PATH}`);
  console.log(`   refresh_token presente: sim`);
  console.log(`   scope: ${tokens.scope}`);
  console.log('\nPróximo passo: node --env-file=.env.local scripts/analytics/test-auth.mjs');
}

main().catch((e) => {
  console.error('❌ Erro fatal:', e.message);
  process.exit(1);
});
