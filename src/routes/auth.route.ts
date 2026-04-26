import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthController } from "../controllers/auth.controller";
import { RegisterSchema, LoginSchema } from "../types/auth.type";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "supersecret"
        })
    )
    .post("/register", AuthController.register, { body: RegisterSchema })
    .post("/login", AuthController.login, { body: LoginSchema });
