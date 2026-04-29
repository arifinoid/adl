import { Elysia } from "elysia";
import { AuthService } from "../modules/auth/service";

const authService = new AuthService();

export const authMiddleware = (app: Elysia) => 
    app
        .derive(async ({ request, set }) => {
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

            const user = await authService.findSessionByToken(token);

            if (!user) {
                set.status = 401;
                return { user: null };
            }

            return {
                user
            };
        })
        .onBeforeHandle(({ user, set }) => {
            if (!user) {
                set.status = 401;
                return { message: "Unauthorized" };
            }
        });

