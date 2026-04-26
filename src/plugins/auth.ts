import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authPlugin = new Elysia({ name: 'auth-plugin' })
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
    .derive({ as: 'global' }, async ({ jwt, request }) => {
        const auth = request.headers.get("authorization");
        
        if (!auth) return { user: null };

        const token = auth.split(" ")[1];
        if (!token) return { user: null };

        const payload = await jwt.verify(token);
        return { user: payload || null };
    });

export const isAuth = new Elysia({ name: 'is-auth' })
    .use(authPlugin)
    .onBeforeHandle({ as: 'global' }, ({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { message: "Unauthorized" };
        }
    });
