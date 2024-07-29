import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import { Server as SocketIOServer } from 'socket.io';

// Initialize Express app
const app = express();

// CORS configuration
const corsConfig = {
  origin: [
    'https://vk-chat-beta.vercel.app', // Vercel URL for frontend
    'http://localhost:3000', // Local frontend URL
  ],
  credentials: true,
};
app.use(cors(corsConfig));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
mongoDBConnect();

// Start server
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      'https://vk-chat-beta.vercel.app', // Vercel URL for frontend
      'http://localhost:3000', // Local frontend URL
    ],
    methods: ['GET', 'POST'],
  },
});
