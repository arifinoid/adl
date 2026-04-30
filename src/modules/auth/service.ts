import { db } from "../../db";
import { users, sessions } from "../../db/schema";
import { eq, or, and } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;

export class AuthService {
    async findByEmail(email: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return user || null;
    }

    async findByIdentity(identity: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(or(eq(users.username, identity), eq(users.email, identity)))
            .limit(1);
        return user || null;
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

    async createSession(userId: number): Promise<string> {
        const token = crypto.randomUUID();
        await db.insert(sessions).values({
            userId,
            token,
        });
        return token;
    }

    async findSessionByToken(token: string) {
        const [session] = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: sessions.createdAt,
            })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.token, token))
            .limit(1);
        return session || null;
    }
}

