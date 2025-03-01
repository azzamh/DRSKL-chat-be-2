import { NewUser, User } from "@db/schema";
import * as schema from '@db/schema';
import { db } from "@src/db";

export const insertNewUser = async (data: NewUser, trx?: any) => {
    const query = trx ? trx.insert(schema.users) : db.insert(schema.users);

    return await query
        .values({
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
        })
        .returning({
            id: schema.users.id,
            username: schema.users.username,
            full_name: schema.users.full_name,
        });
};