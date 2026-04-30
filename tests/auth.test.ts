import { describe, it, expect, beforeEach } from "bun:test";
import { app } from "../src/index";
import { clearDatabase } from "./utils";

describe("Auth Module", () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user with valid data", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "testuser",
                        email: "test@example.com",
                        password: "password123"
                    })
                })
            );

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.message).toBe("User registered successfully");
            expect(data.user.username).toBe("testuser");
        });

        it("should fail if username/email already exists", async () => {
            // Pre-register
            await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "testuser",
                        email: "test@example.com",
                        password: "password123"
                    })
                })
            );

            const res = await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "testuser",
                        email: "test2@example.com",
                        password: "password123"
                    })
                })
            );

            expect(res.status).toBe(400);
            const data = (await res.json()) as any;
            expect(data.message).toBe("User or email already exists");
        });

        it("should fail on invalid payload", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "t", // too short maybe? let's see RegisterModel
                        email: "not-an-email"
                    })
                })
            );

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            // Register a user to login with
            await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "loginuser",
                        email: "login@example.com",
                        password: "password123"
                    })
                })
            );
        });

        it("should login successfully with correct credentials", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "login@example.com",
                        password: "password123"
                    })
                })
            );

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.message).toBe("Login berhasil");
            expect(data.token).toBeDefined();
        });

        it("should fail with incorrect password", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "login@example.com",
                        password: "wrongpassword"
                    })
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe("POST /api/auth/logout", () => {
        let token: string;

        beforeEach(async () => {
            await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "logoutuser",
                        email: "logout@example.com",
                        password: "password123"
                    })
                })
            );

            const loginRes = await app.handle(
                new Request("http://localhost/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "logout@example.com",
                        password: "password123"
                    })
                })
            );
            const loginData = (await loginRes.json()) as any;
            token = loginData.token;
        });

        it("should logout successfully with valid token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
            );

            expect(res.status).toBe(200);
            expect(((await res.json()) as any).message).toBe("OK");

            // Verify session is gone by trying to access profile
            const profileRes = await app.handle(
                new Request("http://localhost/api/users/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );
            expect(profileRes.status).toBe(401);
        });

        it("should fail logout without token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/logout", {
                    method: "POST"
                })
            );

            expect(res.status).toBe(401);
        });
    });
});
