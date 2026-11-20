import { verify } from '@node-rs/argon2'
import { createSessionCookie, createSessionToken } from '../../server/session.js'

function getRequestBody(request) {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body)
  }

  return request.body || {}
}

function getSupabaseHeaders(adminKey) {
  const headers = { apikey: adminKey }

  if (!adminKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${adminKey}`
  }

  return headers
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  let code = ''
  try {
    code = String(getRequestBody(request).code || '').trim()
  } catch {
    return response.status(400).json({ error: 'Invalid request' })
  }

  if (!code || code.length > 128) {
    return response.status(401).json({ error: 'Invalid invite code' })
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !adminKey || !process.env.SESSION_SECRET) {
    console.error('Invite code API environment variables are missing.')
    return response.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const query = new URLSearchParams({ select: 'user_id,passcode_hash' })
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/access_codes?${query}`, {
      headers: getSupabaseHeaders(adminKey),
    })

    if (!supabaseResponse.ok) {
      console.error('Supabase access_codes query failed:', supabaseResponse.status)
      return response.status(500).json({ error: 'Server error' })
    }

    const accessCodes = await supabaseResponse.json()
    let matchedUserId = null

    for (const accessCode of accessCodes) {
      if (await verify(accessCode.passcode_hash, code)) {
        matchedUserId = accessCode.user_id
        break
      }
    }

    if (!matchedUserId) {
      return response.status(401).json({ error: 'Invalid invite code' })
    }

    const sessionToken = createSessionToken(matchedUserId)
    response.setHeader('Set-Cookie', createSessionCookie(sessionToken))

    return response.status(200).json({ redirectTo: '/builder' })
  } catch (error) {
    console.error('Invite code verification failed:', error)
    return response.status(500).json({ error: 'Server error' })
  }
}
