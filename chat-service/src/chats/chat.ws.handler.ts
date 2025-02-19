import { DecodedToken } from '@src/shared/types'
import * as userService from '@src/users/services'
import * as chatService from '@src/chats/services'
import { Server, Socket } from 'socket.io'
import { updatePresenceStatus } from '@src/users/services/updatePresenceStatus.service'
import * as redis from '@src/shared/redisAdapter'
import { send } from 'process'
import { group } from 'console'
import { json } from 'stream/consumers'



const userSocketMap = new Map<string, string>();
/**
 * Fungsi untuk mendaftarkan event "chat" pada socket
 * @param io - instance Server Socket.IO (global)
 * @param socket - instance Socket khusus client yang terhubung
 */
export async function chatHandler(io: Server, socket: Socket) {

  try{
    //user connected
    const tokenData = (socket as any).userData as DecodedToken
    const userId = tokenData.id.toString()

    let user = await initConectedUser(userId, socket)


    // event "send_messages" 
    socket.on('send_messages', async (data: any) => {
      console.log(`Raw message from user [${userId}]:`, data);
      
      let parsedData: SendMeddagePayload;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (error) {
        console.error('Failed to parse message data:', error);
        return;
      }

      const { conversationId, message, isGroup } = parsedData;
      if (!isGroup) {
        const resp = await chatService.sendPrivateMessage(userId, conversationId, message);
        console.log('Response from chatService.sendPrivateMessage:', resp);
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
      user = await updatePresenceStatus(user.data.id, false)
    })

    // Subscribe to Redis channel for messages
    redis.subscribeToChannel(`send_messages:${userId}`, async (data) => {
      console.log('====================>>>>>>>Message from redis:', data);
      const pubsubPrivateMessageData = JSON.parse(data) as PubsubPrivateMessageData
      console.log('Message from redis pubsubPrivateMessageData:', pubsubPrivateMessageData);
      const resp = await chatService.getMessageById(pubsubPrivateMessageData.messageId)
      const message = resp.data
      console.log('Message from redis message:', message);
      const recipientSocketId = userSocketMap.get(pubsubPrivateMessageData.recipientId);
      if (recipientSocketId) {
        console.log('Sending message to recipient:', recipientSocketId, message);
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

interface SendMeddagData{
  conversationId: string;
  message: string;
  isGroup: boolean;
}

type SendMeddagePayload = SendMeddagData//[SendMeddagData];


async function initConectedUser(userId: string, socket: Socket) {
  userSocketMap.set(userId, socket.id);
  let user = await userService.getUserInfoService(userId)

  if (user.status !== 200) {
    socket.disconnect()
    throw new Error('User not found')
  }

  console.log('====================')
  console.log('Client connected, userData:', user.data)

  //set user lastactivity &  status to online
  user = await updatePresenceStatus(user.data.id, true)
  return user
}