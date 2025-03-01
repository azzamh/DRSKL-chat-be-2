import axios from 'axios';
import { USER_SERVICE_URL } from '@src/shared/config/services.config';

export interface UserResponse {
  status: number;
  data: {
    id: string;
    // ... other user properties
  };
}

export async function getUserInfo(userId: string): Promise<UserResponse> {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}
