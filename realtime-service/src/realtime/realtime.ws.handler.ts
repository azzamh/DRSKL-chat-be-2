import { DecodedToken } from '@src/shared/types'
import * as userClient from '@src/users/client'
import * as chatClient from '@src/chats/client'
import * as presenceClient from '@src/presence/client'
import { Server, Socket } from 'socket.io'
import * as redis from '@src/shared/redisAdapter'



const userSocketMap = new Map<string, string>();
/**
 * Fungsi untuk mendaftarkan event "chat" pada socket
 * @param io - instance Server Socket.IO (global)
 * @param socket - instance Socket khusus client yang terhubung
 */
export async function chatHandler(io: Server, socket: Socket) {

  try {
    //user connected
    const tokenData = (socket as any).userData as DecodedToken
    const userId = tokenData.id.toString()

    let user = await initConectedUser(userId, socket)


    // event "send_messages" 
    socket.on('send_messages', async (data: any) => {

      console.log('>>>>>>>>>>>send_messages', socket.id, data);
      const authHeader = socket.handshake.headers;
      console.log('Authorization header:', userId, authHeader.authorization);
      console.log(`Raw message from user [${userId}]:`, data);

      let parsedData: SendMeddagePayload;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (error) {
        console.error('Failed to parse message data:', error);
        return;
      }

      const { conversationId, message, isGroup } = parsedData;
      console.log('>>>>>>>>>>>>:', socket.id, userId, conversationId, message, isGroup);
      if (!isGroup) {
        const resp = await chatClient.sendPrivateMessage(userId, conversationId, message);
        console.log('Response from chatClient.sendPrivateMessage:', resp);
        if (resp.status === 201) {
          io.to(socket.id).emit('send_messages_ok', resp.data);
        }
      }
    })

    // Event disconnect
    socket.on('disconnect', async () => {
      console.log('====================')
      console.log('Client disconnected:', userId)

      //set user lastactivity &  status to offline
      user = await presenceClient.updatePresenceStatus(user.data.id, false)
    })

    // Subscribe to Redis channel for messages
    redis.subscribeToChannel(`send_messages:${userId}`, async (data) => {
      // console.log('====================>>>>>>>Message from redis:', data);
      const pubsubPrivateMessageData = JSON.parse(data) as PubsubPrivateMessageData
      // console.log('Message from redis pubsubPrivateMessageData:', pubsubPrivateMessageData);
      const resp = await chatClient.getMessageById(pubsubPrivateMessageData.messageId)
      const message = resp.data
      // console.log('Message from redis message:', message);
      const recipientSocketId = userSocketMap.get(pubsubPrivateMessageData.recipientId);
      if (recipientSocketId) {
        // console.log('Sending message to recipient:', recipientSocketId, message);
        io.to(recipientSocketId).emit('receive_message', message);
      }
    });
  } catch (error) {
    console.error('Error in chatHandler:', error)
    socket.disconnect()
    // redis.unsubscribeFromChannel(`send_messages:${userId}`)
  }

}


interface PubsubPrivateMessageData {
  senderId: string;
  recipientId: string;
  messageId: number;
}

interface SendMeddagData {
  conversationId: string;
  message: string;
  isGroup: boolean;
}

type SendMeddagePayload = SendMeddagData//[SendMeddagData];


async function initConectedUser(userId: string, socket: Socket) {
  userSocketMap.set(userId, socket.id);
  let user = await userClient.getUserInfo(userId)

  if (user.status !== 200) {
    socket.disconnect()
    throw new Error('User not found')
  }

  console.log('====================')
  console.log('Client connected, userData:', user.data)

  //TODO: presence service set user lastactivity &  status to online
  user = await presenceClient.updatePresenceStatus(user.data.id, true)

  return user
}