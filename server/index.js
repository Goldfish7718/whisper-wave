// PACKAGE IMPORTS
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { processPrivateMessage } from './controllers/chatControllers.js';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';

config()

// ROUTE IMPORTS 
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

// CONSTANTS
const app = express();
const PORT = process.env.PORT || 5000

// MIDDLEWARE
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// ROUTES
app.use('/users', userRoutes)
app.use('/chats', chatRoutes)

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN
    }
})

const connectDB = async (DB_URI) => {
    await mongoose
        .connect(DB_URI)
        .then(() => console.log("Database Connected"))
        .catch(err => console.log(err))
}

export const users = {}; 

// SOCKET IO CONFIG ADN EVENTS
io.on('connection', (socket) => {
    socket.on('register', ({ userId }) => {
        users[userId] = socket.id;
        console.log(`User registered: ${userId}`);
    });

    socket.on('privateMessage', ({ sender, recipient, message }) => {
        processPrivateMessage(socket, { sender, recipient, message })
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

app.get('/', (_, res) => {
    res.json(users)
})

server.listen(PORT, async () => {
    await connectDB(process.env.DB_URI)
    console.log(`Server is running on port ${PORT}`);
});