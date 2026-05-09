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

import { cache } from "../../plugins/cache";

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
    .get("/home", async ({ user }) => {
        const cacheKey = `activities:summary:${user!.id}`;
        const cached = cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) return cached.data;

        const data = await activityService.getSummary(user!.id);
        cache.set(cacheKey, { data, expiry: Date.now() + 60000 });
        return data;
    }, {
        detail: {
            tags: ['Activities'],
            summary: 'Get dashboard summary'
        }
    })
    .get("/", async ({ user, query }) => {
        const cacheKey = `activities:list:${user!.id}:${JSON.stringify(query)}`;
        const cached = cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) return cached.data;

        const data = await activityService.findByUser(user!.id, query);
        cache.set(cacheKey, { data, expiry: Date.now() + 30000 }); // 30s cache for list
        return data;
    }, {
        query: 'activity.query',
        response: t.Array(ActivityModel),
        detail: {
            tags: ['Activities'],
            summary: 'List user activities'
        }
    })
    .get("/:id", async ({ params, user, set }) => {
        const cacheKey = `activities:detail:${user!.id}:${params.id}`;
        const cached = cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) return cached.data;

        const activity = await activityService.findById(params.id, user!.id);
        if (!activity) {
            set.status = 404;
            return { message: "Activity not found" };
        }
        
        cache.set(cacheKey, { data: activity, expiry: Date.now() + 60000 });
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
        const result = await activityService.create({
            userId: user!.id,
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        });

        // Invalidate all activities cache for this user
        for (const key of cache.keys()) {
            if (key.startsWith(`activities:summary:${user!.id}`) || key.startsWith(`activities:list:${user!.id}`)) {
                cache.delete(key);
            }
        }

        return result;
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
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
            imageUrl: body.imageUrl
        };

        const updated = await activityService.update(params.id, user!.id, updateData);
        if (!updated) {
            set.status = 404;
            return { message: "Activity not found" };
        }

        // Invalidate cache
        for (const key of cache.keys()) {
            if (
                key.startsWith(`activities:summary:${user!.id}`) || 
                key.startsWith(`activities:list:${user!.id}`) ||
                key === `activities:detail:${user!.id}:${params.id}`
            ) {
                cache.delete(key);
            }
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

        // Invalidate cache
        for (const key of cache.keys()) {
            if (
                key.startsWith(`activities:summary:${user!.id}`) || 
                key.startsWith(`activities:list:${user!.id}`) ||
                key === `activities:detail:${user!.id}:${params.id}`
            ) {
                cache.delete(key);
            }
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
