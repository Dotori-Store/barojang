import { createHmac, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE_NAME = 'barojang_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const LOCAL_SESSION_SECRET = 'barojang-local-development-session-secret'

export function isLocalDevelopment() {
  return process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'development'
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET || (isLocalDevelopment() ? LOCAL_SESSION_SECRET : '')

  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters.')
  }

  return secret
}

function sign(value) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url')
}

export function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    }),
  ).toString('base64url')

  return `${payload}.${sign(payload)}`
}

export function readSessionToken(token) {
  if (!token) {
    return null
  }

  const [payload, receivedSignature] = token.split('.')
  if (!payload || !receivedSignature) {
    return null
  }

  const expectedSignature = sign(payload)
  const receivedBuffer = Buffer.from(receivedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!session.userId || session.expiresAt <= Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export function readCookie(request, name) {
  const cookieHeader = request.headers.cookie || ''
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())
  const prefix = `${name}=`
  const cookie = cookies.find((value) => value.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

export function createSessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''

  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ].join('; ') + secure
}
