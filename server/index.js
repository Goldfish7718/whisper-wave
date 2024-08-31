// index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

const users = {}; // Store users and their socket IDs

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        users[userId] = socket.id;
        console.log(`User registered: ${userId}`);
    });

    socket.on('privateMessage', ({ sender, recipient, message }) => {
        const recipientSocketId = users[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('privateMessage', { sender, message });
            console.log(`Message from ${sender} to ${recipient}: ${message}`);
        } else {
            console.log(`User ${recipient} not found`);
        }
    });

    socket.on('disconnect', () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});