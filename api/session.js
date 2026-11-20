import { readCookie, readSessionToken, SESSION_COOKIE_NAME } from '../server/session.js'

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = readCookie(request, SESSION_COOKIE_NAME)
    const session = readSessionToken(token)

    return response.status(200).json({ authenticated: Boolean(session) })
  } catch (error) {
    console.error('Session verification failed:', error)
    return response.status(500).json({ authenticated: false })
  }
}
