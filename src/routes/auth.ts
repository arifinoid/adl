import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { jwt } from "@elysiajs/jwt";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "supersecret"
        })
    )
    .post(
        "/register",
        async ({ body, set }) => {
            const { username, email, password } = body;

            // Check if user exists
            const existingUser = await db
                .select()
                .from(users)
                .where(or(eq(users.username, username), eq(users.email, email)))
                .limit(1);

            if (existingUser.length > 0) {
                set.status = 400;
                return { message: "User or email already exists" };
            }

            // Hash password
            const hashedPassword = await Bun.password.hash(password);

            // Create user
            const [newUser] = await db
                .insert(users)
                .values({
                    username,
                    email,
                    password: hashedPassword,
                })
                .returning();

            return {
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                },
            };
        },
        {
            body: t.Object({
                username: t.String(),
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 6 }),
            }),
        }
    )
    .post(
        "/login",
        async ({ body, set, jwt }) => {
            const { identity, password } = body; // identity can be username or email

            const [user] = await db
                .select()
                .from(users)
                .where(or(eq(users.username, identity), eq(users.email, identity)))
                .limit(1);

            if (!user) {
                set.status = 401;
                return { message: "Invalid credentials" };
            }

            const isPasswordValid = await Bun.password.verify(password, user.password);

            if (!isPasswordValid) {
                set.status = 401;
                return { message: "Invalid credentials" };
            }

            const token = await jwt.sign({
                id: user.id,
                username: user.username,
            });

            return {
                message: "Login successful",
                token,
            };
        },
        {
            body: t.Object({
                identity: t.String(),
                password: t.String(),
            }),
        }
    );
