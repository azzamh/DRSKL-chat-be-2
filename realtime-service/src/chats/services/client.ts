import axios from 'axios';
import { CHAT_SERVICE_URL } from '@src/shared/config/services.config';


const client = axios.create({
  baseURL: CHAT_SERVICE_URL+'/api/chat',
});


export const getRoomList = async (token: string, page = 1, limit = 20) => {
  try {
    const response = await client.get(`${CHAT_SERVICE_URL}/room/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomMessages = async (token: string, roomId: string, page = 1, limit = 20) => {
  try {
    const response = await client.get(`/room/${roomId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (token: string, roomId: string, message: string) => {
  try {
    const response = await client.post(
      `/message/send`,
      { room_id: roomId, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (token: string, roomId: string, name: string) => {
  try {
    const response = await client.post(
      `/room/create`,
      { room_id: roomId, name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinRoom = async (token: string, roomId: string) => {
  try {
    const response = await client.post(
      `/room/${roomId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMessageById = async (token: string, messageId: string) => {
  try {
    const response = await client.get(`/message/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addOrUpdateUser = async (userId: string, username: string, fullname: string) => {
  try {
    const response = await client.post(`/user`, {
      id: userId,
      username,
      fullname
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomParticipants = async (token: string, roomId: string) => {
  try {
    const response = await client.get(`/room/${roomId}/participants`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
