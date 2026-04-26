import { Elysia } from "elysia";
import { authPlugin, isAuth } from "../../plugins/auth";
import { ActivityService } from "./service";
import { 
    CreateActivityModel, 
    UpdateActivityModel, 
    ActivityParamsModel, 
    ActivityQueryModel 
} from "./model";

const activityService = new ActivityService();

export const activityModule = new Elysia({ prefix: "/activities", name: "activity" })
    .use(authPlugin)
    .use(isAuth)
    .model({
        'activity.create': CreateActivityModel,
        'activity.update': UpdateActivityModel,
        'activity.params': ActivityParamsModel,
        'activity.query': ActivityQueryModel
    })
    .get("/home", ({ user }) => {
        return activityService.getSummary(user!.id);
    })
    .get("/", ({ user, query }) => {
        return activityService.findByUser(user!.id, query);
    }, {
        query: 'activity.query'
    })
    .get("/:id", async ({ params, user, set }) => {
        const activity = await activityService.findById(params.id, user!.id);
        if (!activity) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        return activity;
    }, {
        params: 'activity.params'
    })
    .post("/", async ({ body, user }) => {
        return await activityService.create({
            userId: user!.id,
            title: body.title,
            description: body.description,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        });
    }, {
        body: 'activity.create'
    })
    .patch("/:id", async ({ params, body, user, set }) => {
        const updateData = {
            ...body,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined
        };

        const updated = await activityService.update(params.id, user!.id, updateData);
        if (!updated) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        return updated;
    }, {
        params: 'activity.params',
        body: 'activity.update'
    })
    .delete("/:id", async ({ params, user, set }) => {
        const success = await activityService.delete(params.id, user!.id);
        if (!success) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        return { message: "Activity deleted successfully" };
    }, {
        params: 'activity.params'
    });
