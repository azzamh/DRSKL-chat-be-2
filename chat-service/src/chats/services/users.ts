import * as dao from "@src/chats/dao";
import { InternalServerErrorResponse, OkResponse, CreatedResponse } from "@src/shared/commons/patterns";

export const addUser = async (id: string, username: string, fullName?: string) => {
  try {
    const user = await dao.insertUser({
      id,
      username,
      full_name: fullName
    });
    console.log('>>>>>>>>>addUser user:', user);

    return new CreatedResponse({
      message: 'User created successfully',
      user
    }).generate();
  } catch (err: any) {
    console.error('addUser error:', err);
    return new InternalServerErrorResponse(
      err.message || 'Failed to create user'
    ).generate();
  }
}

export const updateUser = async (params: {
  id: string;
  username?: string;
  full_name?: string;
}) => {
  try {
    const updatedUser = await dao.updateUser({
      id: params.id,
      username: params.username,
      full_name: params.full_name
    });

    return new OkResponse({
      message: 'User updated successfully',
      user: updatedUser
    }).generate();
  } catch (err: any) {
    console.error('updateUser error:', err);
    return new InternalServerErrorResponse(
      err.message || 'Failed to update user'
    ).generate();
  }
}

export const addOrUpdateUser = async (id: string, username: string, fullName?: string) => {
  try {
    const user = await dao.getUserById(id);
    if
    (!user) {
      return addUser(id, username, fullName);
    }
    return updateUser({
      id, username, full_name: fullName
    });
  } catch (err: any) {
    console.error('addOrUpdateUser error:', err);
    return new InternalServerErrorResponse(
      err.message || 'Failed to add or update user'
    ).generate();
  }
}

