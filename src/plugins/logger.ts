import { Elysia } from "elysia";

export const loggerPlugin = new Elysia({ name: 'logger' })
    .onRequest(({ request }) => {
        console.log(`[${new Date().toISOString()}] <-- ${request.method} ${request.url}`);
    })
    .onAfterHandle(({ request, set }) => {
        console.log(`[${new Date().toISOString()}] --> ${request.method} ${request.url} | Status: ${set.status}`);
    })
    .onError(({ request, error, code }) => {
        const message = error instanceof Error ? error.message : (error as any)?.message || 'Internal Server Error';
        console.error(`[${new Date().toISOString()}] !!! ${request.method} ${request.url} | Error: ${code} - ${message}`);
    });
