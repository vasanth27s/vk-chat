import express from 'express';
import dotenv from 'dotenv/config';
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
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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
    ],
    methods: ['GET', 'POST'],
  },
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieve) => {
    const chat = newMessageRecieve.chatId;
    if (!chat.users) {
      console.log('chats.users is not defined');
      return;
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieve.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieve);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
