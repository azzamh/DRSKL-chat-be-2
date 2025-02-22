import { NewUser } from "@db/schema/users/users";
import * as schema from '@db/schema';
import { db } from "@src/db";

export const insertNewUser = async (data: NewUser) => {
    const result = await db
        .insert(schema.users)
        .values({
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
        })
        .returning({
            id: schema.users.id,
            username: schema.users.username,
            full_name: schema.users.full_name,
        })
    return result;
}

