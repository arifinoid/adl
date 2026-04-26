import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authMiddleware = (app: Elysia) => 
    app
        .use(
            jwt({
                name: "jwt",
                secret: process.env.JWT_SECRET || "supersecret"
            })
        )
        .derive(async ({ jwt, request }) => {
            const auth = request.headers.get("authorization");
            
            if (!auth) return { user: null };

            const token = auth.split(" ")[1];
            if (!token) return { user: null };

            const payload = await jwt.verify(token);
            return { user: payload || null };
        })
        .onBeforeHandle(({ user, set }) => {
            if (!user) {
                set.status = 401;
                return { message: "Unauthorized" };
            }
        });
