import axios from 'axios';
import { PRESENCE_SERVICE_URL } from '@src/shared/config/services.config';

export interface PresenceResponse {
  status: number;
  data: {
    id: string;
    isOnline: boolean;
    lastActivity: Date;
  };
}

export async function updatePresenceStatus(userId: string, isOnline: boolean): Promise<PresenceResponse> {
  try {
    const response = await axios.patch(`${PRESENCE_SERVICE_URL}/presence/${userId}`, {
      isOnline,
      lastActivity: new Date()
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating presence status:', error);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}
