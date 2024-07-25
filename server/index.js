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

const app = express();

const corsConfig = {
  origin: [
    'https://vk-chat-beta.vercel.app/', // Replace with your frontend URL
  ],
  credentials: true,
};
app.use(cors(corsConfig));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

mongoose.set('strictQuery', false);
mongoDBConnect();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});

const io = new SocketIOServer(server, {
  cors: {
    origin: [
      'https://vk-chat-beta.vercel.app/', 
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
