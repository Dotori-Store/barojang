import { randomUUID } from 'node:crypto'
import { readCookie, readSessionToken, SESSION_COOKIE_NAME } from '../../server/session.js'

const allowedImageTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

function getRequestBody(request) {
  if (typeof request.body === 'string') return JSON.parse(request.body)
  return request.body || {}
}

function getSupabaseHeaders(adminKey) {
  const headers = { apikey: adminKey }
  if (!adminKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${adminKey}`
  return headers
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const session = readSessionToken(readCookie(request, SESSION_COOKIE_NAME))
  if (!session) return response.status(401).json({ error: 'Unauthorized' })

  let contentType
  try {
    contentType = String(getRequestBody(request).contentType || '')
  } catch {
    return response.status(400).json({ error: 'Invalid request' })
  }

  const extension = allowedImageTypes[contentType]
  if (!extension) return response.status(400).json({ error: 'Only JPG and PNG are allowed' })

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !adminKey) {
    console.error('Supabase environment variables are missing.')
    return response.status(500).json({ error: 'Server configuration error' })
  }

  const path = `${session.userId}/${randomUUID()}.${extension}`
  const encodedPath = path.split('/').map(encodeURIComponent).join('/')

  try {
    const signedResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/upload/sign/product-images/${encodedPath}`,
      {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(adminKey),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    if (!signedResponse.ok) {
      console.error('Signed upload URL creation failed:', signedResponse.status)
      return response.status(502).json({ error: 'Could not prepare image upload' })
    }

    const signedUpload = await signedResponse.json()
    if (!signedUpload.token) {
      console.error('Signed upload response did not include a token.')
      return response.status(502).json({ error: 'Invalid upload response' })
    }

    const uploadUrl = `${supabaseUrl}/storage/v1/object/upload/sign/product-images/${encodedPath}?token=${encodeURIComponent(signedUpload.token)}`
    return response.status(200).json({ path, uploadUrl })
  } catch (error) {
    console.error('Signed upload URL creation failed:', error)
    return response.status(500).json({ error: 'Server error' })
  }
}
