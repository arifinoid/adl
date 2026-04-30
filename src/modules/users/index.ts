import { Elysia, t } from "elysia";
import { isAuth } from "../../plugins/auth";
import { ProfileResponseModel } from "./model";

export const userModule = new Elysia({ prefix: "/users", name: "user" })
    .use(isAuth)
    .get("/profile", ({ user }) => {
        return {
            id: user!.id,
            email: user!.email,
            name: user!.username, // Using username as name
            created_at: user!.createdAt.toISOString(),
        };
    }, {
        response: {
            200: ProfileResponseModel,
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Users'],
            summary: 'Get current user profile'
        }
    });
