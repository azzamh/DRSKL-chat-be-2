// src/index.ts
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import userRouter from './users/user.routes';
import jwt from 'jsonwebtoken';
import { DecodedToken } from './shared/types';

const app = express();
const server = createServer(app);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRouter);


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

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
