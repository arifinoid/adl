import { Elysia, t } from "elysia";
import { isAuth } from "../../plugins/auth";

const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL || "http://localhost:8081";

export const uploadModule = new Elysia({ prefix: "/upload", name: "upload" })
    .use(isAuth)
    .post("/avatar", async ({ body, set }) => {
        try {
            const formData = new FormData();
            formData.append("file", body.file);

            const response = await fetch(`${FILE_SERVICE_URL}/api/upload/avatar`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                set.status = response.status;
                return await response.json();
            }

            return await response.json();
        } catch (error) {
            set.status = 500;
            return { message: "Failed to forward request to file-service", error: String(error) };
        }
    }, {
        body: t.Object({
            file: t.File()
        }),
        detail: {
            tags: ['Upload'],
            summary: 'Upload avatar image (Proxy to file-service)'
        }
    })
    .post("/activity", async ({ body, set }) => {
        try {
            const formData = new FormData();
            formData.append("file", body.file);

            const response = await fetch(`${FILE_SERVICE_URL}/api/upload/activity`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                set.status = response.status;
                return await response.json();
            }

            return await response.json();
        } catch (error) {
            set.status = 500;
            return { message: "Failed to forward request to file-service", error: String(error) };
        }
    }, {
        body: t.Object({
            file: t.File()
        }),
        detail: {
            tags: ['Upload'],
            summary: 'Upload activity image (Proxy to file-service)'
        }
    });
