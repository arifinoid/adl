import { Elysia } from "elysia";
import { AuthService } from "../modules/auth/service";

const authService = new AuthService();

export const authPlugin = new Elysia({ name: 'auth-plugin' })
    .derive({ as: 'global' }, async ({ request }) => {
        const auth = request.headers.get("authorization");

        if (!auth) return { user: null, token: null };

        const token = auth.split(" ")[1];
        if (!token) return { user: null, token: null };

        const user = await authService.findSessionByToken(token);
        return {
            user: user || null,
            token: user ? token : null
        };
    });

export const isAuth = new Elysia({ name: 'is-auth' })
    .use(authPlugin)
    .onBeforeHandle({ as: 'global' }, ({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { message: "Unauthorized" };
        }
    });

