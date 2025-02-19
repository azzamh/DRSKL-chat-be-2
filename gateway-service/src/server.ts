import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';
import ioClient from 'socket.io-client';
import cors from 'cors';

// Import service discovery & sticky session logic
import { chatDiscovery } from '@src/services/chatDiscovery';
import { getOrPickChatInstance } from '@src/services/stickySession';

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer,{
  cors: {
    origin: "*", // In production, replace with your client URL
    methods: ["GET", "POST"]
  }
});
// 1) Inisialisasi ioredis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,  // If Redis is secured
  db: 0                        // Optional: Select specific DB (default is 0)
});

// 2) Forward HTTP ke User Service
app.use('/api/user', createProxyMiddleware({
  target: `${process.env.USER_SERVICE}:${process.env.USER_SERVICE_PORT}`,
  changeOrigin: true,
  pathRewrite: { '': '/api/user' }
}));


app.use('/api/chat', createProxyMiddleware({
  target: `${process.env.CHAT_SERVICE}:${process.env.CHAT_SERVICE_PORT}`,
  changeOrigin: true,
  pathRewrite: { '': '/api/chat' }
}));

// 3) Lakukan Chat Discovery (polling daftar instance Chat Service) 
let chatInstances: string[] = [];
chatDiscovery((instances) => {
  chatInstances = instances;
  console.log('Updated chatInstances:', chatInstances);
});

// 4) Tangani WebSocket
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Misalnya userId diambil dari query param
  // const userId = socket.handshake.query.userId as string;
  // if (!userId) {
  //   console.log('No userId provided, disconnecting...');
  //   socket.disconnect();
  //   return;
  // }
  console.log('User connected:', socket.handshake.query);


  // Tentukan instance Chat Service untuk user ini (sticky session)
  // getOrPickChatInstance(redisClient, userId, chatInstances)
    // .then((instance) => {
    const instance = chatInstances[0];
      if (!instance) {
        console.error('No chat instance available');
        socket.disconnect();
        return;
      }
      // console.log(`User ${userId} -> chat instance: ${instance}`);

      // Contoh bridging socket.io client ke Pod Chat Service
      const [host, port] = instance.split(':');
      // const chatSocket = ioClient(`ws://${host}:${port}`, {
      //   query: { userId },
      // });
      const chatSocket = ioClient(`ws://${host}:${port}`);

      // Forward event client -> chat service
      socket.on('send_messages', (msg: any) => {
        // Ensure msg is stringified if it's an object
        console.log('send_messages:', msg);
        const messageData = typeof msg === 'string' ? msg : JSON.stringify(msg);
        chatSocket.emit('send_messages', messageData);  // Note: changed to 'send_messages' to match chat service
      });

      // Forward event chat service -> client
      chatSocket.on('receive_message', (data: any) => {
        // Parse the message if it's a string, otherwise send as is
        const messageData = typeof data === 'string' ? JSON.parse(data) : data;
        socket.emit('receive_message', messageData);
      });

      socket.on('disconnect', () => {
        // console.log(`Client ${userId} disconnected from gateway`);
        chatSocket.disconnect();
      });
    })
    // .catch((err) => {
    //   console.error('Error picking chat instance:', err);
    //   socket.disconnect();
    // });
// });

// 5) Jalankan Gateway
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
