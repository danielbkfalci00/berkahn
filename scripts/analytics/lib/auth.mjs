import { google } from 'googleapis';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const SA_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './secrets/google-service-account.json';
const OAUTH_CLIENT_PATH = path.resolve('./secrets/oauth-client.json');
const OAUTH_TOKENS_PATH = path.resolve('./secrets/oauth-tokens.json');
const OAUTH_CLIENT_JSON = process.env.GOOGLE_OAUTH_CLIENT_JSON;
const OAUTH_TOKENS_JSON = process.env.GOOGLE_OAUTH_TOKENS_JSON;
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const ADC_PATH_WIN = path.join(os.homedir(), 'AppData', 'Roaming', 'gcloud', 'application_default_credentials.json');
const ADC_PATH_UNIX = path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json');

// AUTH_MODE:
//   "oauth" — OAuth2 user flow (refresh token salvo). RECOMENDADO pro bug GA4 SA de abr/2025.
//   "adc"   — Application Default Credentials (gcloud auth application-default login)
//   "sa"    — Service Account JSON (legacy / quando SA está autorizado nos sistemas)
//   "auto"  — tenta oauth → adc → sa
const AUTH_MODE = (process.env.GOOGLE_AUTH_MODE || 'auto').toLowerCase();

let cachedAuth = null;

function oauthExists() {
  return Boolean(OAUTH_CLIENT_JSON && OAUTH_TOKENS_JSON)
    || (fs.existsSync(OAUTH_CLIENT_PATH) && fs.existsSync(OAUTH_TOKENS_PATH));
}

function adcExists() {
  return fs.existsSync(ADC_PATH_WIN) || fs.existsSync(ADC_PATH_UNIX);
}

function saExists() {
  return Boolean(SERVICE_ACCOUNT_JSON) || fs.existsSync(SA_PATH);
}

export function getServiceAccountInfo() {
  if (!saExists()) return null;
  if (SERVICE_ACCOUNT_JSON) return JSON.parse(SERVICE_ACCOUNT_JSON);
  return JSON.parse(fs.readFileSync(SA_PATH, 'utf-8'));
}

export function getActiveAuthMode() {
  if (AUTH_MODE === 'oauth') return 'oauth';
  if (AUTH_MODE === 'adc') return 'adc';
  if (AUTH_MODE === 'sa') return 'sa';
  // auto: priority OAuth → ADC → SA
  if (oauthExists()) return 'oauth';
  if (adcExists()) return 'adc';
  if (saExists()) return 'sa';
  return null;
}

function buildOAuth2Client() {
  const credentials = OAUTH_CLIENT_JSON
    ? JSON.parse(OAUTH_CLIENT_JSON)
    : JSON.parse(fs.readFileSync(OAUTH_CLIENT_PATH, 'utf-8'));
  const tokens = OAUTH_TOKENS_JSON
    ? JSON.parse(OAUTH_TOKENS_JSON)
    : JSON.parse(fs.readFileSync(OAUTH_TOKENS_PATH, 'utf-8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
  oauth2Client.setCredentials(tokens);

  // Atualizar tokens.json quando refresh acontecer
  oauth2Client.on('tokens', (newTokens) => {
    if (OAUTH_TOKENS_JSON) return;
    const merged = { ...tokens, ...newTokens };
    fs.writeFileSync(OAUTH_TOKENS_PATH, JSON.stringify(merged, null, 2));
  });

  return oauth2Client;
}

export function getAuth(scopes) {
  if (cachedAuth) return cachedAuth;
  const mode = getActiveAuthMode();

  if (mode === 'oauth') {
    cachedAuth = buildOAuth2Client();
    return cachedAuth;
  }

  if (mode === 'adc') {
    cachedAuth = new google.auth.GoogleAuth({ scopes });
    return cachedAuth;
  }

  if (mode === 'sa') {
    cachedAuth = new google.auth.GoogleAuth({
      ...(SERVICE_ACCOUNT_JSON
        ? { credentials: JSON.parse(SERVICE_ACCOUNT_JSON) }
        : { keyFile: path.resolve(SA_PATH) }),
      scopes,
    });
    return cachedAuth;
  }

  throw new Error(
    'Nenhuma credencial Google encontrada.\n' +
    'Opção recomendada (OAuth user flow):\n' +
    '  1. Criar OAuth client (Desktop) em console.cloud.google.com\n' +
    '  2. Salvar JSON em secrets/oauth-client.json\n' +
    '  3. Rodar: node scripts/analytics/oauth-login.mjs'
  );
}

export function getGa4PropertyId() {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error('GA4_PROPERTY_ID missing in .env.local');
  return id;
}

export function getGscSiteUrl() {
  const url = process.env.GSC_SITE_URL || 'sc-domain:berkahn.com.br';
  return url;
}
