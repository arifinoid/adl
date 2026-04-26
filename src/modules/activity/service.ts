import { db } from "../../db";
import { activities } from "../../db/schema";
import { eq, and, desc, like, SQL } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { ActivityQuery } from "./model";

export type Activity = InferSelectModel<typeof activities>;
export type NewActivity = InferInsertModel<typeof activities>;

export class ActivityService {
    async findByUser(userId: number, query?: ActivityQuery): Promise<Activity[]> {
        const filters: SQL[] = [eq(activities.userId, userId)];

        if (query?.completed !== undefined) {
            filters.push(eq(activities.isCompleted, query.completed));
        }

        if (query?.search) {
            filters.push(like(activities.title, `%${query.search}%`));
        }

        return await db
            .select()
            .from(activities)
            .where(and(...filters))
            .limit(query?.limit ?? 10)
            .offset(query?.offset ?? 0)
            .orderBy(desc(activities.createdAt));
    }

    async findById(id: number, userId: number): Promise<Activity | null> {
        const [activity] = await db
            .select()
            .from(activities)
            .where(and(eq(activities.id, id), eq(activities.userId, userId)))
            .limit(1);
        return activity || null;
    }

    async create(data: NewActivity): Promise<Activity> {
        const [newActivity] = await db
            .insert(activities)
            .values(data)
            .returning();
        return newActivity;
    }

    async update(id: number, userId: number, data: Partial<NewActivity>): Promise<Activity | null> {
        const [updatedActivity] = await db
            .update(activities)
            .set(data)
            .where(and(eq(activities.id, id), eq(activities.userId, userId)))
            .returning();
        return updatedActivity || null;
    }

    async delete(id: number, userId: number): Promise<boolean> {
        const result = await db
            .delete(activities)
            .where(and(eq(activities.id, id), eq(activities.userId, userId)))
            .returning();
        return result.length > 0;
    }

    async getSummary(userId: number) {
        const list = await this.findByUser(userId, { limit: 100 });
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
