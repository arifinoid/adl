import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.route";
import { activityRoutes } from "./routes/activity.route";

const port = process.env.PORT || 8000;

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .get("/", () => ({
        message: "ADL Backend API",
        status: "running"
    }))
    .group("/api", (app) =>
        app
            .use(authRoutes)
            .use(activityRoutes)
            .get("/health", () => ({ status: "ok" }))
        // Protected routes will go here
    )
    .listen(port);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
