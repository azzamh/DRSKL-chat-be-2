import { NewUser } from "@db/schema/user/users";
import * as schema from '@db/schema';
import { db } from "@src/db";
import { eq } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";

export interface UpdateUserDao {
    id: string;
    username?: string;
    full_name?: string;
    password?: string;
}

export const updateUser = async (data: UpdateUserDao) => {
  const updateData: Partial<UpdateUserDao> = {};
  if (data.username) {
    updateData.username = data.username;
  }
  if (data.full_name) {
    updateData.full_name = data.full_name;
  }
  if (data.password) {
    updateData.password = data.password;
  }
    const result = await db
        .update(schema.users)
        .set({
            ...updateData,
            updated_at: new Date()
        })
        .where(
            eq(schema.users.id, data.id)
        )
        .returning({
            id: schema.users.id,
            username: schema.users.username,
            full_name: schema.users.full_name,
            created_at: schema.users.created_at,
            updated_at: schema.users.updated_at
        })
    return result;
}

