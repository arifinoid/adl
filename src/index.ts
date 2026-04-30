import { Elysia } from "elysia";
import { ElysiaSwaggerConfig, swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { authModule } from "./modules/auth";
import { activityModule } from "./modules/activity";
import { userModule } from "./modules/users";
import { loggerPlugin } from "./plugins/logger";

const port = process.env.PORT || 8000;
const SWAGGER_OPTS: ElysiaSwaggerConfig = {
    path: '/swagger',
    scalarConfig: {
        theme: 'kepler',
        layout: 'modern',
    },
    documentation: {
        info: {
            title: 'ADL Backend Documentation',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    }
}

const handleError = ({ code, error, set }: any) => {
    if (code === 'VALIDATION') {
        set.status = 400;
        return {
            success: false,
            message: "Validation Error",
            errors: error.all
        };
    }

    console.error(error);

    return {
        success: false,
        message: error.message || "Internal Server Error"
    };
}

export const app = new Elysia()
    .use(cors())
    .use(loggerPlugin)
    .use(swagger(SWAGGER_OPTS))
    .get("/", () => ({
        message: "ADL Backend API",
        status: "running"
    }))
    .group("/api", (app) =>
        app
            .get("/health", () => ({ status: "ok" }))
            .use(authModule)
            .use(activityModule)
            .use(userModule)
    )
    .onError(handleError);

if (import.meta.main) {
    app.listen({
        port: Number(port),
        hostname: '0.0.0.0'
    });

    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    );
}

export type App = typeof app;
