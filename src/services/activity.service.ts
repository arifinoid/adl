import { db } from "../db";
import { activities } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Activity = InferSelectModel<typeof activities>;
export type NewActivity = InferInsertModel<typeof activities>;

export class ActivityService {
    async findByUser(userId: number): Promise<Activity[]> {
        return await db
            .select()
            .from(activities)
            .where(eq(activities.userId, userId))
            .orderBy(desc(activities.createdAt));
    }

    async findById(id: number, userId: number): Promise<Activity | undefined> {
        const [activity] = await db
            .select()
            .from(activities)
            .where(and(eq(activities.id, id), eq(activities.userId, userId)))
            .limit(1);
        return activity;
    }

    async create(data: NewActivity): Promise<Activity> {
        const [newActivity] = await db
            .insert(activities)
            .values(data)
            .returning();
        return newActivity;
    }

    async getSummary(userId: number) {
        const list = await this.findByUser(userId);
        const total = list.length;
        const completed = list.filter(a => a.isCompleted).length;
        
        return {
            total,
            completed,
            pending: total - completed,
            latest: list.slice(0, 5)
        };
    }
}
