import { db } from "@src/db";
import { userStatuses } from "@db/schema/presence/userStatus";
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';


export const getUserLastSeen = async (username: string) => {
    try {
        const result = await db
            .select({
                last_seen: userStatuses.last_seen
            })
            .from(userStatuses)
            .where(
              eq(userStatuses.userName, username)
            )
            .limit(1);

        return result[0];
    } catch (error) {
        console.error("getUserLastSeen error", error);
        throw error;
    }
}

export const upsertUserLastSeen = async (username: string, last_seen: Date) => {
    try {
        const result = await db
            .insert(userStatuses)
            .values({
                userName: username,
                last_seen: last_seen
            })
            .onConflictDoUpdate({
                target: userStatuses.userName,
                set: { last_seen: last_seen }
            });

        return result;
    } catch (error) {
        console.error("upsertUserLastSeen error", error);
        throw error;
    }
}
