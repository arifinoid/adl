import { describe, it, expect, beforeEach } from "bun:test";
import { app } from "../src/index";
import { clearDatabase } from "./utils";

describe("Activity Module", () => {
    let token: string;
    let otherToken: string;

    beforeEach(async () => {
        await clearDatabase();

        // Register and login main user
        await app.handle(
            new Request("http://localhost/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "actuser", email: "act@example.com", password: "password" })
            })
        );
        const loginRes = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "act@example.com", password: "password" })
            })
        );
        token = ((await loginRes.json()) as any).token;

        // Register and login another user for isolation tests
        await app.handle(
            new Request("http://localhost/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "other", email: "other@example.com", password: "password" })
            })
        );
        const otherLoginRes = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "other@example.com", password: "password" })
            })
        );
        otherToken = ((await otherLoginRes.json()) as any).token;
    });

    describe("POST /api/activities", () => {
        it("should create an activity with valid data", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/activities", {
                    method: "POST",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: "Test Activity",
                        description: "Test Description"
                    })
                })
            );

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.title).toBe("Test Activity");
            expect(data.id).toBeDefined();
        });

        it("should return 401 without token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/activities", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: "No Token" })
                })
            );
            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/activities", () => {
        beforeEach(async () => {
            // Create some activities for main user
            await app.handle(new Request("http://localhost/api/activities", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ title: "User Act 1" })
            }));
            // Create an activity for other user
            await app.handle(new Request("http://localhost/api/activities", {
                method: "POST",
                headers: { "Authorization": `Bearer ${otherToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Other Act" })
            }));
        });

        it("should return only user's activities", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/activities", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data).toHaveLength(1);
            expect(data[0].title).toBe("User Act 1");
        });
    });

    describe("PATCH /api/activities/:id", () => {
        let activityId: number;

        beforeEach(async () => {
            const createRes = await app.handle(new Request("http://localhost/api/activities", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Patch Me" })
            }));
            activityId = ((await createRes.json()) as any).id;
        });

        it("should update user's activity", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/activities/${activityId}`, {
                    method: "PATCH",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ isCompleted: true })
                })
            );

            expect(res.status).toBe(200);
            expect(((await res.json()) as any).isCompleted).toBe(true);
        });

        it("should return 404 when updating other user's activity", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/activities/${activityId}`, {
                    method: "PATCH",
                    headers: { 
                        "Authorization": `Bearer ${otherToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ title: "Hacker" })
                })
            );
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /api/activities/:id", () => {
        let activityId: number;

        beforeEach(async () => {
            const createRes = await app.handle(new Request("http://localhost/api/activities", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Delete Me" })
            }));
            activityId = ((await createRes.json()) as any).id;
        });

        it("should delete user's activity", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/activities/${activityId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );

            expect(res.status).toBe(200);

            // Verify it's gone
            const getRes = await app.handle(
                new Request(`http://localhost/api/activities/${activityId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );
            expect(getRes.status).toBe(404);
        });
    });
});
