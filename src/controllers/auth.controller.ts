import type { Context } from "elysia";
import { AuthService } from "../services/auth.service";
import type { RegisterBody, LoginBody, UserPayload } from "../types/auth.type";

const authService = new AuthService();

export const AuthController = {
    async register({ body, set }: Context & { body: RegisterBody }) {
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
    },

    async login({ body, set, jwt }: Context & { 
        body: LoginBody; 
        jwt: { sign: (payload: UserPayload) => Promise<string> } 
    }) {
        const { identity, password } = body;

        const user = await authService.findByIdentity(identity);
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
    }
};
