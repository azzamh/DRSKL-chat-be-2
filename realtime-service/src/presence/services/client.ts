import axios from 'axios';
import { PRESENCE_SERVICE_URL } from '@src/shared/config/services.config';

const client = axios.create({
  baseURL: PRESENCE_SERVICE_URL+'/api/presence',
});

export const setOnlineStatus = async (token: string, isOnline: boolean) => {
  return client.post('/online', { is_online: isOnline }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getOnlineStatus = async (token: string, username: string) => {
  return client.get(`/online/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const setTypingStatus = async (token: string, isTyping: boolean) => {
  return client.post('/typing', { is_typing: isTyping }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTypingStatus = async (token: string, username: string) => {
  return client.get(`/typing/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getLastSeen = async (token: string, username: string) => {
  return client.get(`/lastseen/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
