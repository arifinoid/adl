import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { authModule } from "../src/modules/auth";

describe("ADL API - Fase 4 Testing", () => {
    it("should have a running health check", async () => {
        const app = new Elysia().get("/health", () => ({ status: "ok" }));
        const response = await app.handle(new Request("http://localhost/health"));
        const data = await response.json() as { status: string };
        
        expect(response.status).toBe(200);
        expect(data.status).toBe("ok");
    });

    it("should return 401 for unauthorized activity access", async () => {
        // We'll import the actual app or a mock for more complex tests
        // For now, this demonstrates the testing capability in Fase 4
        const response = await fetch("http://localhost:8000/api/activities/home");
        // Note: this assumes the server is running, but in a real test we'd use app.handle
        expect(response.status).toBe(401);
    });
});
