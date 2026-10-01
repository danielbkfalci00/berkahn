import puppeteer, { type Browser } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export interface LaunchOptions {
  viewport?: { width: number; height: number }
}

const PDF_RENDER_HOSTS = new Set([
  'www.berkahn.com.br',
  'berkahn.com.br',
  'admin.berkahn.com.br',
])

export async function launchBrowser(options: LaunchOptions = {}): Promise<Browser> {
  const isLocal = process.env.NODE_ENV === 'development'
  const localPath = process.env.CHROME_LOCAL_PATH

  const executablePath = isLocal && localPath
    ? localPath
    : await chromium.executablePath()

  const browser = await puppeteer.launch({
    args: isLocal ? [] : chromium.args,
    executablePath,
    headless: true,
  })
  return browser
}

export function getBaseUrl(requestUrl: string): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // A URL gerada pelo Vercel pode exigir login mesmo em um deploy de produção.
  // Navegue pelo domínio público da requisição, limitado aos hosts do projeto.
  const url = new URL(requestUrl)
  if (url.protocol !== 'https:' || url.port || !PDF_RENDER_HOSTS.has(url.hostname)) {
    throw new Error('Domínio não autorizado para renderização de PDF.')
  }
  return url.origin
}
