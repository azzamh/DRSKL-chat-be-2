import * as schema from '@db/schema/user/users';
import { db } from "@src/db";
import { eq, and } from "drizzle-orm";

export const getUserById = async (user_id: string) => {
    const result = await db
        .select({
            id: schema.users.id,
            username: schema.users.username,
            // email: schema.users.email,
            full_name: schema.users.full_name,
            created_at: schema.users.created_at,
            updated_at: schema.users.updated_at
        })
        .from(schema.users)
        .where(
            and(
                eq(schema.users.id, user_id)
            )
        )
    return result[0];
}

export const getUserByUsername = async (username: string) => {
    const result = await db
        .select()
        .from(schema.users)
        .where(
            and(
                eq(schema.users.username, username),
            )
        )
    return result[0];
}
