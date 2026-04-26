import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { ActivityController } from "../controllers/activity.controller";
import { CreateActivitySchema, ActivityParamsSchema } from "../types/activity.type";

export const activityRoutes = new Elysia({ prefix: "/activities" })
    .use(authMiddleware)
    .get("/home", ActivityController.getHome)
    .get("/", ActivityController.list)
    .get("/:id", ActivityController.getDetail, {
        params: ActivityParamsSchema
    })
    .post("/", ActivityController.create, {
        body: CreateActivitySchema
    });
