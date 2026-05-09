import { rateLimit } from 'elysia-rate-limit'

// Helper to get real IP when behind a proxy (like Render, Vercel, etc)
const getIP = (req: Request, server: Bun.Server<unknown> | null) => {
    return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || server?.requestIP(req)?.address || '127.0.0.1';
}

// Global rate limit: 100 requests per 1 minute
export const globalRateLimit = rateLimit({
    duration: 60000,
    max: 100,
    generator: getIP,
    errorResponse: new Response(JSON.stringify({
        success: false,
        message: 'Too many requests, please try again later.'
    }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
    })
})

// Strict rate limit for auth: 20 requests per 1 minute (increased from 5 to avoid false positives)
export const authRateLimit = rateLimit({
    duration: 60000,
    max: 20,
    generator: (req, server) => `auth:${getIP(req, server)}`, // Use a prefix in the key to separate from global limiter
    errorResponse: new Response(JSON.stringify({
        success: false,
        message: 'Too many login attempts, please try again in a minute.'
    }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
    })
})
