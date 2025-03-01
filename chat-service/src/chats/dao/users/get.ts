import { eq, inArray } from 'drizzle-orm';
import { db } from "@src/db";
import { users } from '@db/schema/chat/users';

interface User {
    id: string;
    username: string;
    full_name: string | null;
}

export const getUserIdsByUsernames = async (usernames: string[]): Promise<string[]> => {
    try {
        const result = await db
            .select({ id: users.id, username: users.username })
            .from(users)
            .where(inArray(users.username, usernames));

        if (result.length !== usernames.length) {
            const foundUsernames = result.map(row => row.username);
            const missingUsernames = usernames.filter(username => !foundUsernames.includes(username));
            throw new Error(`Some usernames not found: ${missingUsernames.join(', ')}`);
        }

        return result.map(row => row.id);
    } catch (error) {
        console.error("getUserIdsByUsernames error", error);
        throw error;
    }
}

export const getUserById = async (user_id: string): Promise<User> => {
    try {
        const result = await db
            .select({
                id: users.id,
                username: users.username,
                full_name: users.full_name,
            })
            .from(users)
            .where(eq(users.id, user_id))
            .limit(1);

        return result[0];
    } catch (error) {
        console.error("getUserById error", error);
        throw error;
    }
}

export const getUserByUsername = async (username: string): Promise<User> => {
    try {
        const result = await db
            .select({
                id: users.id,
                username: users.username,
                full_name: users.full_name,
            })
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        return result[0];
    } catch (error) {
        console.error("getUserByUsername error", error);
        throw error;
    }
}