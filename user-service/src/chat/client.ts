import axios from 'axios';
import { CHAT_SERVICE_URL } from '@src/shared/config/services.config';

const baseUrl = CHAT_SERVICE_URL;

export async function addOrUpdateUser(id: string, username: string, fullname: string): Promise<void> {
    try {
        const resp = await axios.post(`${baseUrl}/api/chat/user`, { id, username, fullname });
        if (resp.status !== 201 && resp.status !== 200) {
            throw new Error('Failed to add user to chat service');
        }
    } catch (error) {
        console.error('Failed to add user to chat service:', error);
        throw error;
    }
}
