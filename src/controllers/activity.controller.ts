import type { Context } from "elysia";
import { ActivityService } from "../services/activity.service";
import type { CreateActivityBody, UpdateActivityBody, ActivityQuery } from "../types/activity.type";
import type { UserPayload } from "../types/auth.type";

const activityService = new ActivityService();

// Helper type for authenticated context
type AuthContext = Context & {
    user: UserPayload;
};

export const ActivityController = {
    async getHome({ user }: AuthContext) {
        return await activityService.getSummary(user.id);
    },

    async list({ user, query }: AuthContext & { query: ActivityQuery }) {
        return await activityService.findByUser(user.id, query);
    },

    async getDetail({ params, user, set }: AuthContext & { params: { id: number } }) {
        const activity = await activityService.findById(params.id, user.id);

        if (!activity) {
            set.status = 404;
            return { message: "Activity not found" };
        }

        return activity;
    },

    async create({ body, user }: AuthContext & { body: CreateActivityBody }) {
        return await activityService.create({
            userId: user.id,
            title: body.title,
            description: body.description,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        });
    },

    async update({ params, body, user, set }: AuthContext & { params: { id: number }; body: UpdateActivityBody }) {
        const updateData = {
            ...body,
            scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined
        };

        const updated = await activityService.update(params.id, user.id, updateData);

        if (!updated) {
            set.status = 404;
            return { message: "Activity not found" };
        }

        return updated;
    },

    async delete({ params, user, set }: AuthContext & { params: { id: number } }) {
        const success = await activityService.delete(params.id, user.id);

        if (!success) {
            set.status = 404;
            return { message: "Activity not found" };
        }

        return { message: "Activity deleted successfully" };
    }
};
