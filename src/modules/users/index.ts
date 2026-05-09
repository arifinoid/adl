import { Elysia, t } from "elysia";
import { isAuth } from "../../plugins/auth";
import { ProfileResponseModel, UpdateProfileModel } from "./model";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const userModule = new Elysia({ prefix: "/users", name: "user" })
    .use(isAuth)
    .get("/profile", ({ user }) => {
        return {
            id: user!.id,
            email: user!.email,
            username: user!.username,
            avatarUrl: user!.avatarUrl,
            createdAt: user!.createdAt.toISOString(),
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
    })
    .patch("/profile", async ({ user, body }) => {
        const [updatedUser] = await db
            .update(users)
            .set(body)
            .where(eq(users.id, user!.id))
            .returning();
        
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            avatarUrl: updatedUser.avatarUrl,
            createdAt: updatedUser.createdAt.toISOString(),
        };
    }, {
        body: UpdateProfileModel,
        response: {
            200: ProfileResponseModel,
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Users'],
            summary: 'Update user profile'
        }
    });
