import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { setupChatSockets } from "./sockets/chat";
import { setupPresenceSockets } from "./sockets/presence";
import { socketAuthMiddleware } from "./sockets/authMiddleware";

dotenv.config();

const port = process.env.PORT || 8001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

io.use(socketAuthMiddleware);

setupChatSockets(io);
setupPresenceSockets(io);

server.listen(port, () => {
  console.log(`server runnning on port ${port}`);
});
