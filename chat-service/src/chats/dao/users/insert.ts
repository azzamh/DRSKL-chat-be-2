import { db } from "@src/db";
import { users } from "@db/schema/chat/users";
import { User, NewUser } from "@db/schema/chat/users";
import { v4 as uuidv4 } from 'uuid';

interface CreateUserParams {
  id: string;
  username: string;
  full_name?: string;
}

export const insertUser = async (params: CreateUserParams): Promise<User> => {
  try {
    const newUser: NewUser = {
      id: params.id,
      username: params.username,
      full_name: params.full_name || null
    };

    const [createdUser] = await db
      .insert(users)
      .values(newUser)
      .returning();

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    return createdUser;
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Username already exists');
    }
    console.error("insertUser error", error);
    throw error;
  }
}
