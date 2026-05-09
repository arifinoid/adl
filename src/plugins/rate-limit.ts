import { rateLimit } from 'elysia-rate-limit'

const responseInit = {
    status: 429,
    headers: {
        'Content-Type': 'application/json'
    }
}

// Global rate limit: 100 requests per 1 minute
export const globalRateLimit = rateLimit({
    duration: 60000,
    max: 100,
    errorResponse: new Response(JSON.stringify({
        success: false,
        message: 'Too many requests, please try again later.'
    }), responseInit)
})

// Strict rate limit for auth: 5 requests per 1 minute
export const authRateLimit = rateLimit({
    duration: 60000,
    max: 5,
    errorResponse: new Response(JSON.stringify({
        success: false,
        message: 'Too many login attempts, please try again in a minute.'
    }), responseInit)
})
