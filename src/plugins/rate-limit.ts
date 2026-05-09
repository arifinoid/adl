import { rateLimit } from 'elysia-rate-limit'

// Global rate limit: 100 requests per 1 minute
export const globalRateLimit = rateLimit({
    duration: 60000,
    max: 100,
    responseCode: 429,
    responseMessage: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
})

// Strict rate limit for auth: 5 requests per 1 minute
export const authRateLimit = rateLimit({
    duration: 60000,
    max: 5,
    responseCode: 429,
    responseMessage: {
        success: false,
        message: 'Too many login attempts, please try again in a minute.'
    }
})
