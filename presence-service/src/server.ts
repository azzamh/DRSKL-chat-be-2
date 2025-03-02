// src/index.ts
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { DecodedToken } from './shared/types';
// import { chatHandler } from './chats/chat.ws.handler';

const app = express();
const server = createServer(app);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A simple route
app.get('/', (_req: Request, res: Response) => {
  res.send('Socket.IO 1-on-1 Chat Server is running.');
});

// Routes
// app.use('/api/chat', chatRouter);


// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


interface PrivateMessage {
  from: string;
  to: string;
  content: string;
}

const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your client URL
    methods: ["GET", "POST"]
  }
});


/**
 * Middleware Socket.IO untuk verifikasi JWT
 * - Client mengirim token lewat "handshake.auth.token".
 * - Jika token valid, kita lanjutkan koneksi; jika tidak, tolak.
 */
io.use((socket, next) => {
  // Ambil token dari socket handshake
  // const token = socket.handshake.auth?.token as string
  const token = socket.handshake.query.token as string | undefined;
  console.log('Token from query:', token);


  // Verifikasi JWT
  if (!process.env.JWT_SECRET) {
    return next(new Error('JWT_SECRET is not configured'))
  }

  jwt.verify(Array.isArray(token) ? token[0] : token, process.env.JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      console.error('JWT Error:', err)
      return next(new Error('Authentication error'))
    }

    // Simpan data user di socket (cast ke any untuk simplifikasi)
    ; (socket as any).userData = decoded as DecodedToken
    return next()
  })
})



// Event utama Socket.IO
// io.on('connection', async (socket) => {
//   chatHandler(io, socket)
// })



// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
