import { createServer as createHttpServer } from 'node:http'
import { createServer as createViteServer } from 'vite'
import sessionHandler from '../api/session.js'
import verifyInviteCodeHandler from '../api/invite-code/verify.js'
import productUploadUrlHandler from '../api/product-image/upload-url.js'
import productsHandler from '../api/products.js'
import publicProductHandler from '../api/public-product.js'

const port = Number(process.env.BAROJANG_DEV_PORT || process.env.PORT) || 5173
const host = '127.0.0.1'
const maxJsonBodySize = 1024 * 1024
const missingEnvironmentVariables = ['SUPABASE_URL', 'SESSION_SECRET'].filter(
  (name) => !process.env[name],
)

if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  missingEnvironmentVariables.push('SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY')
}

if (missingEnvironmentVariables.length > 0) {
  console.error(`Missing local environment variables: ${missingEnvironmentVariables.join(', ')}`)
  console.error('Add them to .env.admin.local. See .env.example for the required names.')
  process.exit(1)
}

const apiRoutes = new Map([
  ['/api/session', sessionHandler],
  ['/api/invite-code/verify', verifyInviteCodeHandler],
  ['/api/product-image/upload-url', productUploadUrlHandler],
  ['/api/products', productsHandler],
  ['/api/public-product', publicProductHandler],
])

function addVercelResponseHelpers(response) {
  response.status = (statusCode) => {
    response.statusCode = statusCode
    return response
  }

  response.json = (value) => {
    if (!response.headersSent) response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(value))
    return response
  }
}

async function readJsonBody(request) {
  if (!request.headers['content-type']?.includes('application/json')) return undefined

  const chunks = []
  let size = 0

  for await (const chunk of request) {
    size += chunk.length
    if (size > maxJsonBodySize) throw new Error('Request body is too large')
    chunks.push(chunk)
  }

  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const vite = await createViteServer({
  server: {
    middlewareMode: true,
    hmr: { port: port + 20000 },
  },
  appType: 'spa',
})

const server = createHttpServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`).pathname
  const handler = apiRoutes.get(pathname)

  if (!handler) {
    vite.middlewares(request, response)
    return
  }

  addVercelResponseHelpers(response)

  try {
    request.body = await readJsonBody(request)
    await handler(request, response)
  } catch (error) {
    console.error(`Local API failed for ${request.method} ${pathname}:`, error)
    if (!response.headersSent) response.status(400).json({ error: 'Invalid request' })
    else response.end()
  }
})

server.listen(port, host, () => {
  console.log(`Barojang full local server: http://${host}:${port}`)
  console.log('Vite UI and /api routes are running together.')
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await vite.close()
    server.close(() => process.exit(0))
  })
}
