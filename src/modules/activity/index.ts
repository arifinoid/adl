import { Elysia, t } from "elysia";
import { authPlugin, isAuth } from "../../plugins/auth";
import { ActivityService } from "./service";
import { 
    CreateActivityModel, 
    UpdateActivityModel, 
    ActivityParamsModel, 
    ActivityQueryModel,
    ActivityModel
} from "./model";

const activityService = new ActivityService();

export const activityModule = new Elysia({ prefix: "/activities", name: "activity" })
    .use(authPlugin)
    .use(isAuth)
    .model({
        'activity.create': CreateActivityModel,
        'activity.update': UpdateActivityModel,
        'activity.params': ActivityParamsModel,
        'activity.query': ActivityQueryModel,
        'activity.response': ActivityModel
    })
    .get("/home", ({ user }) => activityService.getSummary(user!.id), {
        detail: {
            tags: ['Activities'],
            summary: 'Get dashboard summary'
        }
    })
    .get("/", ({ user, query }) => activityService.findByUser(user!.id, query), {
        query: 'activity.query',
        response: t.Array(ActivityModel),
        detail: {
            tags: ['Activities'],
            summary: 'List user activities'
        }
    })
    .get("/:id", async ({ params, user, set }) => {
        const activity = await activityService.findById(params.id, user!.id);
        if (!activity) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        return activity;
    }, {
        params: 'activity.params',
        response: {
            200: ActivityModel,
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Activities'],
            summary: 'Get activity detail'
        }
    })
    .post("/", async ({ body, user }) => {
        return await activityService.create({
            userId: user!.id,
            title: body.title,
            description: body.description,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        });
    }, {
        body: 'activity.create',
        response: ActivityModel,
        detail: {
            tags: ['Activities'],
            summary: 'Create new activity'
        }
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
        body: 'activity.update',
        response: {
            200: ActivityModel,
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Activities'],
            summary: 'Update activity'
        }
    })
    .delete("/:id", async ({ params, user, set }) => {
        const success = await activityService.delete(params.id, user!.id);
        if (!success) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        return { message: "Activity deleted successfully" };
    }, {
        params: 'activity.params',
        response: {
            200: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Activities'],
            summary: 'Delete activity'
        }
    });
