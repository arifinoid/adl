import type { Context } from "elysia";
import { ActivityService } from "../services/activity.service";
import type { CreateActivityBody } from "../types/activity.type";

const activityService = new ActivityService();

export const ActivityController = {
    async getHome({ user }: any) {
        return await activityService.getSummary(user.id);
    },

    async list({ user }: any) {
        return await activityService.findByUser(user.id);
    },

    async getDetail({ params, user, set }: any) {
        const activity = await activityService.findById(params.id, user.id);
        
        if (!activity) {
            set.status = 404;
            return { message: "Activity not found" };
        }

        return activity;
    },

    async create({ body, user }: any) {
        const { title, description, scheduledAt } = body as CreateActivityBody;
        
        return await activityService.create({
            userId: user.id,
            title,
            description,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        });
    }
};
