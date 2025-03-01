import axios from 'axios';
import { CHAT_SERVICE_URL } from '@src/shared/config/services.config';
const CHAT_BASE_URL = `${CHAT_SERVICE_URL}/api/chat`;

export interface ChatResponse {
  status: number;
  data: any;
}

export async function sendPrivateMessage(userId: string, conversationId: string, message: string): Promise<ChatResponse> {
  try {
    const response = await axios.post(`${CHAT_BASE_URL}/message/send`, {
      userId,
      conversationId,
      message
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error sending private message:', error);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

export async function getMessageById(messageId: number): Promise<ChatResponse> {
  try {
    const response = await axios.get(`${CHAT_BASE_URL}/message/${messageId}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching message:', error);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}
