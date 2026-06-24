import puppeteer, { type Browser } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export interface LaunchOptions {
  viewport?: { width: number; height: number }
}

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
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  try {
    const url = new URL(requestUrl)
    return url.origin
  } catch {
    return 'http://localhost:3000'
  }
}
