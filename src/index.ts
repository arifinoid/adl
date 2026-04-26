import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { authModule } from "./modules/auth";
import { activityModule } from "./modules/activity";

const port = process.env.PORT || 8000;

const app = new Elysia()
    .use(cors())
    .use(swagger({
        documentation: {
            info: {
                title: 'ADL Backend Documentation',
                version: '1.0.0'
            }
        }
    }))
    .get("/", () => ({
        message: "ADL Backend API",
        status: "running"
    }))
    .group("/api", (app) => 
        app
            .use(authModule)
            .use(activityModule)
            .get("/health", () => ({ status: "ok" }))
    )
    .listen(port);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
