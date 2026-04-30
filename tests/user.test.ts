import { describe, it, expect, beforeEach } from "bun:test";
import { app } from "../src/index";
import { clearDatabase } from "./utils";

describe("User Module", () => {
    let token: string;

    beforeEach(async () => {
        await clearDatabase();

        // Register and login a user
        await app.handle(
            new Request("http://localhost/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "profileuser",
                    email: "profile@example.com",
                    password: "password123"
                })
            })
        );

        const loginRes = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "profile@example.com",
                    password: "password123"
                })
            })
        );
        const loginData = await loginRes.json();
        token = loginData.token;
    });

    describe("GET /api/users/profile", () => {
        it("should return user profile with valid token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/users/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.name).toBe("profileuser");
            expect(data.email).toBe("profile@example.com");
            expect(data.id).toBeDefined();
        });

        it("should return 401 without token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/users/profile")
            );

            expect(res.status).toBe(401);
        });

        it("should return 401 with invalid token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/users/profile", {
                    headers: { "Authorization": "Bearer invalid-token" }
                })
            );

            expect(res.status).toBe(401);
        });
    });
});
