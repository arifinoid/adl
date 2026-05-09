import { Elysia } from "elysia";
import { AuthService } from "../modules/auth/service";

import { cache } from "./cache";

const authService = new AuthService();

export const authPlugin = new Elysia({ name: 'auth-plugin' })
    .derive({ as: 'global' }, async ({ request }) => {
        const auth = request.headers.get("authorization");

        if (!auth) return { user: null, token: null };

        const token = auth.split(" ")[1];
        if (!token) return { user: null, token: null };

        // Try to get from cache first
        const cacheKey = `session:${token}`;
        const cachedItem = cache.get(cacheKey);

        if (cachedItem && cachedItem.expiry > Date.now()) {
            return {
                user: cachedItem.data,
                token: cachedItem.data ? token : null
            };
        }

        const user = await authService.findSessionByToken(token);

        // Cache the result for 60 seconds
        cache.set(cacheKey, {
            data: user || null,
            expiry: Date.now() + 60000
        });

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

