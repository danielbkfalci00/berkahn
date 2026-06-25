import { createHmac, timingSafeEqual } from 'crypto'

const TOKEN_TTL_MS = 5 * 60 * 1000

// Sanitiza env (whitespace/newlines) e aceita ambos os nomes —
// SUPABASE_SERVICE_KEY (legado) ou SUPABASE_SERVICE_ROLE_KEY (padrão
// Supabase docs). Mesmo pattern de lib/supabase/admin.ts.
function sanitizeEnv(v: string | undefined): string | undefined {
  return v?.trim().replace(/[\r\n]/g, '') || undefined
}

function getSecret(): string {
  const secret =
    sanitizeEnv(process.env.SUPABASE_SERVICE_KEY) ||
    sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!secret) {
    throw new Error('SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY) ausente do env — necessário para assinar tokens de orçamento')
  }
  return secret
}

function sign(id: string, expiresAt: number): string {
  const payload = `${id}.${expiresAt}`
  const hmac = createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${expiresAt}.${hmac}`
}

export function assinarToken(id: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS
  return sign(id, expiresAt)
}

export function validarToken(id: string, token: string | null | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [expiresAtStr, signature] = parts
  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  const expected = sign(id, expiresAt).split('.')[1]
  const sigBuf = Buffer.from(signature, 'hex')
  const expBuf = Buffer.from(expected, 'hex')
  if (sigBuf.length !== expBuf.length) return false
  try {
    return timingSafeEqual(sigBuf, expBuf)
  } catch {
    return false
  }
}

export const ORCAMENTO_TOKEN_HEADER = 'x-orcamento-token'
