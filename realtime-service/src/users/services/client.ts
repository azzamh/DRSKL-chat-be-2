import axios from 'axios';
import { USER_SERVICE_URL } from '@src/shared/config/services.config';

interface UserResponse {
  status: number;
  message: string;
  data?: any;
}


const client = axios.create({
  baseURL: USER_SERVICE_URL+'/api/user',
});



export const getUserInfo = async (token: string): Promise<UserResponse> => {
  try {
    // console.log('====getUserInfo req:', USER_SERVICE_URL);
    const response = await client.get(`/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log('====getUserInfo response:', response.data);
    return response.data;
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Internal server error'
    };
  }
};



export const getUserByUsername = async (username: string, token: string): Promise<UserResponse> => {
  try {
    const response = await client.get(`/info/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Internal server error'
    };
  }
};
