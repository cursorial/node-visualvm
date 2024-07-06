import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { CONFIG } from './config';
import { initGCObserver } from './gcObserver';
import { setupSocketHandlers } from './socketHandler';

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: CONFIG.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

initGCObserver();
setupSocketHandlers(io);

server.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
