import { db } from "../db";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export class AuthService {
    async findByIdentity(identity: string): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(users)
            .where(or(eq(users.username, identity), eq(users.email, identity)))
            .limit(1);
        return user;
    }

    async createUser(data: NewUser): Promise<User> {
        const [newUser] = await db
            .insert(users)
            .values(data)
            .returning();
        return newUser;
    }

    async userExists(username: string, email: string): Promise<boolean> {
        const existing = await db
            .select()
            .from(users)
            .where(or(eq(users.username, username), eq(users.email, email)))
            .limit(1);
        return existing.length > 0;
    }
}
