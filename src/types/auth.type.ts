import { t } from "elysia";

export const RegisterSchema = t.Object({
    username: t.String(),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
});

export const LoginSchema = t.Object({
    identity: t.String(),
    password: t.String(),
});

export type RegisterBody = typeof RegisterSchema.static;
export type LoginBody = typeof LoginSchema.static;
