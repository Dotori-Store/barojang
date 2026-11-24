import { readCookie, readSessionToken, SESSION_COOKIE_NAME } from '../server/session.js'
import { randomBytes } from 'node:crypto'

const productSelect = [
  'id',
  'name',
  'price',
  'weight',
  'origin',
  'feature',
  'description',
  'shop_name',
  'market_name',
  'phone',
  'image_path',
  'image_version',
  'public_slug',
  'published_at',
].join(',')

const textFields = [
  'name',
  'weight',
  'origin',
  'feature',
  'description',
  'shopName',
  'marketName',
  'phone',
]

function getRequestBody(request) {
  if (typeof request.body === 'string') return JSON.parse(request.body)
  return request.body || {}
}

function getSupabaseHeaders(adminKey) {
  const headers = { apikey: adminKey }
  if (!adminKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${adminKey}`
  return headers
}

function withImageUrl(product, supabaseUrl) {
  if (!product) return null
  const encodedPath = product.image_path?.split('/').map(encodeURIComponent).join('/')
  return {
    ...product,
    image_url: encodedPath
      ? `${supabaseUrl}/storage/v1/object/public/product-images/${encodedPath}`
      : null,
  }
}

function createPublicSlug() {
  return randomBytes(9).toString('base64url').toLowerCase()
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (!['GET', 'POST', 'DELETE'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST, DELETE')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const session = readSessionToken(readCookie(request, SESSION_COOKIE_NAME))
  if (!session) return response.status(401).json({ error: 'Unauthorized' })

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !adminKey) {
    console.error('Supabase environment variables are missing.')
    return response.status(500).json({ error: 'Server configuration error' })
  }

  if (request.method === 'GET') {
    try {
      const query = new URLSearchParams({
        select: productSelect,
        user_id: `eq.${session.userId}`,
        limit: '1',
      })
      const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/products?${query}`, {
        headers: getSupabaseHeaders(adminKey),
      })

      if (!supabaseResponse.ok) {
        console.error('Product query failed:', supabaseResponse.status)
        return response.status(502).json({ error: 'Could not load product' })
      }

      const [product] = await supabaseResponse.json()
      return response.status(200).json({ product: withImageUrl(product, supabaseUrl) })
    } catch (error) {
      console.error('Product query failed:', error)
      return response.status(500).json({ error: 'Server error' })
    }
  }

  if (request.method === 'DELETE') {
    try {
      const productQuery = new URLSearchParams({
        select: 'id,image_path',
        user_id: `eq.${session.userId}`,
        limit: '1',
      })
      const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?${productQuery}`, {
        headers: getSupabaseHeaders(adminKey),
      })

      if (!productResponse.ok) {
        console.error('Product query before delete failed:', productResponse.status)
        return response.status(502).json({ error: 'Could not delete product' })
      }

      const [product] = await productResponse.json()
      if (!product) return response.status(200).json({ deleted: true })

      const deleteQuery = new URLSearchParams({ user_id: `eq.${session.userId}` })
      const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/products?${deleteQuery}`, {
        method: 'DELETE',
        headers: {
          ...getSupabaseHeaders(adminKey),
          Prefer: 'return=minimal',
        },
      })

      if (!deleteResponse.ok) {
        console.error('Product delete failed:', deleteResponse.status)
        return response.status(502).json({ error: 'Could not delete product' })
      }

      let imageDeleted = !product.image_path
      if (product.image_path?.startsWith(`${session.userId}/`)) {
        const encodedPath = product.image_path.split('/').map(encodeURIComponent).join('/')
        const imageResponse = await fetch(
          `${supabaseUrl}/storage/v1/object/product-images/${encodedPath}`,
          {
            method: 'DELETE',
            headers: getSupabaseHeaders(adminKey),
          },
        )
        imageDeleted = imageResponse.ok
        if (!imageResponse.ok) {
          console.error('Product image delete failed:', imageResponse.status)
        }
      }

      return response.status(200).json({ deleted: true, imageDeleted })
    } catch (error) {
      console.error('Product delete failed:', error)
      return response.status(500).json({ error: 'Server error' })
    }
  }

  let body
  try {
    body = getRequestBody(request)
  } catch {
    return response.status(400).json({ error: 'Invalid request' })
  }

  const values = Object.fromEntries(
    textFields.map((field) => [field, String(body[field] || '').trim()]),
  )
  if (textFields.some((field) => !values[field] || values[field].length > 2000)) {
    return response.status(400).json({ error: 'Required product fields are missing' })
  }

  const price = body.price
  if (typeof price !== 'number' || !Number.isSafeInteger(price) || price < 0) {
    return response.status(400).json({ error: 'Invalid price' })
  }

  const imagePath = body.imagePath ? String(body.imagePath) : null
  if (imagePath && !imagePath.startsWith(`${session.userId}/`)) {
    return response.status(400).json({ error: 'Invalid image path' })
  }

  try {
    const existingQuery = new URLSearchParams({
      select: 'public_slug',
      user_id: `eq.${session.userId}`,
      limit: '1',
    })
    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/products?${existingQuery}`, {
      headers: getSupabaseHeaders(adminKey),
    })
    if (!existingResponse.ok) {
      console.error('Existing product query failed:', existingResponse.status)
      return response.status(502).json({ error: 'Could not save product' })
    }

    const [existingProduct] = await existingResponse.json()
    const product = {
      user_id: session.userId,
      name: values.name,
      price,
      weight: values.weight,
      origin: values.origin,
      feature: values.feature,
      description: values.description,
      shop_name: values.shopName,
      market_name: values.marketName,
      phone: values.phone,
      image_path: imagePath,
      image_version: imagePath ? 1 : 0,
      public_slug: existingProduct?.public_slug || createPublicSlug(),
      published_at: new Date().toISOString(),
    }

    const query = new URLSearchParams({ on_conflict: 'user_id' })
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/products?${query}`, {
      method: 'POST',
      headers: {
        ...getSupabaseHeaders(adminKey),
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(product),
    })

    if (!supabaseResponse.ok) {
      console.error('Product upsert failed:', supabaseResponse.status)
      return response.status(502).json({ error: 'Could not save product' })
    }

    const [savedProduct] = await supabaseResponse.json()
    return response.status(200).json({ product: withImageUrl(savedProduct, supabaseUrl) })
  } catch (error) {
    console.error('Product upsert failed:', error)
    return response.status(500).json({ error: 'Server error' })
  }
}
