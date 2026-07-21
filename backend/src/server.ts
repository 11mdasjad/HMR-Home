import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { initSocket } from './services/socketService';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Standard Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Default status route
app.get('/', (req, res) => {
  res.send('🏠 HMR Hostel Management Backend Server Running!');
});

// Initialize Socket connection
initSocket(io);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
