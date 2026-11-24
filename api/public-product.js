const productSelect = [
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

function getSupabaseHeaders(adminKey) {
  const headers = { apikey: adminKey }
  if (!adminKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${adminKey}`
  return headers
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const slug = String(request.query?.slug || new URL(request.url, 'http://localhost').searchParams.get('slug') || '')
  if (!/^[a-z0-9_-]{8,64}$/.test(slug)) {
    return response.status(400).json({ error: 'Invalid product address' })
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !adminKey) return response.status(500).json({ error: 'Server configuration error' })

  try {
    const query = new URLSearchParams({
      select: productSelect,
      public_slug: `eq.${slug}`,
      published_at: 'not.is.null',
      limit: '1',
    })
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/products?${query}`, {
      headers: getSupabaseHeaders(adminKey),
    })

    if (!supabaseResponse.ok) {
      console.error('Public product query failed:', supabaseResponse.status)
      return response.status(502).json({ error: 'Could not load product' })
    }

    const [product] = await supabaseResponse.json()
    if (!product) return response.status(404).json({ error: 'Product not found' })

    const encodedPath = product.image_path?.split('/').map(encodeURIComponent).join('/')
    return response.status(200).json({
      product: {
        ...product,
        image_url: encodedPath
          ? `${supabaseUrl}/storage/v1/object/public/product-images/${encodedPath}`
          : null,
      },
    })
  } catch (error) {
    console.error('Public product query failed:', error)
    return response.status(500).json({ error: 'Server error' })
  }
}
