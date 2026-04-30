import { Elysia, t } from "elysia";
import { AuthService } from "./service";
import { RegisterModel, LoginModel } from "./model";
import { isAuth } from "../../plugins/auth";

const authService = new AuthService();

export const authModule = new Elysia({ prefix: "/auth", name: "auth" })
    .model({
        'auth.register': RegisterModel,
        'auth.login': LoginModel
    })
    .post("/register", async ({ body, set }) => {
        const { username, email, password } = body;

        const exists = await authService.userExists(username, email);
        if (exists) {
            set.status = 400;
            return { message: "User or email already exists" };
        }

        const hashedPassword = await Bun.password.hash(password);
        const newUser = await authService.createUser({
            username,
            email,
            password: hashedPassword,
        });

        return {
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        };
    }, {
        body: 'auth.register',
        response: {
            200: t.Object({
                message: t.String(),
                user: t.Object({
                    id: t.Number(),
                    username: t.String(),
                    email: t.String()
                })
            }),
            400: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Auth'],
            summary: 'Register a new user'
        }
    })
    .post("/login", async ({ body, set }) => {
        const { email, password } = body;

        const user = await authService.findByEmail(email);
        if (!user) {
            set.status = 401;
            return {
                message: "Invalid credentials",
                token: null
            };
        }

        const isPasswordValid = await Bun.password.verify(password, user.password);
        if (!isPasswordValid) {
            set.status = 401;
            return {
                message: "Invalid credentials",
                token: null
            };
        }

        const token = await authService.createSession(user.id);

        return {
            message: "Login berhasil",
            token,
        };
    }, {
        body: 'auth.login',
        response: {
            200: t.Object({
                message: t.String(),
                token: t.String()
            }),
            401: t.Object({
                message: t.String(),
                token: t.Null()
            })
        },
        detail: {
            tags: ['Auth'],
            summary: 'Login to get access token'
        }
    })
    .use(isAuth)
    .post("/logout", async ({ token }) => {
        await authService.deleteSession(token!);
        return { message: "OK" };
    }, {
        response: {
            200: t.Object({ message: t.String() }),
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Auth'],
            summary: 'Logout current user'
        }
    });

