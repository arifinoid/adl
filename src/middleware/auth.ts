import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authMiddleware = (app: Elysia) => 
    app
        .use(
            jwt({
                name: "jwt",
                secret: process.env.JWT_SECRET || "supersecret",
                schema: t.Object({
                    id: t.Number(),
                    username: t.String()
                })
            })
        )
        .derive(async ({ jwt, request, set }) => {
            const auth = request.headers.get("authorization");
            
            if (!auth) {
                set.status = 401;
                return { user: null };
            }

            const token = auth.split(" ")[1];
            if (!token) {
                set.status = 401;
                return { user: null };
            }

            const payload = await jwt.verify(token);

            if (!payload) {
                set.status = 401;
                return { user: null };
            }

            return {
                user: payload
            };
        })
        .onBeforeHandle(({ user, set }) => {
            if (!user) {
                set.status = 401;
                return { message: "Unauthorized" };
            }
        });
