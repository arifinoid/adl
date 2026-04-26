import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .get("/", () => ({
        message: "ADL Backend API",
        status: "running"
    }))
    .group("/api", (app) =>
        app
            .get("/health", () => ({ status: "ok" }))
        // Add other routes here
    )
    .listen(8000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
