import { t } from "elysia";

export const RegisterModel = t.Object({
    username: t.String(),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
});

export const LoginModel = t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
});

export type RegisterBody = typeof RegisterModel.static;
export type LoginBody = typeof LoginModel.static;

export type UserPayload = {
    id: number;
    username: string;
};
