import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authMiddleware = new Elysia()
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "supersecret"
        })
    )
    .derive(async ({ jwt, request, set }) => {
        const auth = request.headers.get("authorization");
        if (!auth) {
            set.status = 401;
            throw new Error("Unauthorized");
        }

        const token = auth.split(" ")[1];
        const payload = await jwt.verify(token);

        if (!payload) {
            set.status = 401;
            throw new Error("Unauthorized");
        }

        return {
            user: payload
        };
    });
