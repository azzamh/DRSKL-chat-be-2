import { db } from "@src/db";
import { users } from "@db/schema/chat/users";
import { eq } from "drizzle-orm";
import { User } from "@db/schema/chat/users";

interface UpdateUserParams {
  id: string;
  username?: string;
  full_name?: string;
}

export const updateUser = async (params: UpdateUserParams): Promise<User> => {
  try {
    const updateData: Partial<User> = {};

    if (params.username) {
      updateData.username = params.username;
    }
    if (params.full_name) {
      updateData.full_name = params.full_name;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, params.id))
      .returning();

    if (!updatedUser) {
      throw new Error(`User with id ${params.id} not found`);
    }

    return updatedUser;
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Username already exists');
    }
    console.error("updateUser error", error);
    throw error;
  }
}
