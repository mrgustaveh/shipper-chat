import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { setupChatSockets } from "./sockets/chat";

const port = process.env.PORT || 8001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

setupChatSockets(io);

server.listen(port, () => {
  console.log(`server runnning on port ${port}`);
});
