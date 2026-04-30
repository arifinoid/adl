import { db } from "../src/db";
import { users, activities, sessions } from "../src/db/schema";

export async function clearDatabase() {
    // Order matters because of foreign keys if not using cascade
    // But since we added cascade, we can just delete
    await db.delete(sessions);
    await db.delete(activities);
    await db.delete(users);
}
