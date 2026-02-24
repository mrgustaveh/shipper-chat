import { Server, Socket } from "socket.io";

export const setupPresenceSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const user = (socket as any).user;

    io.emit("presence", {
      type: "presence",
      user_id: user.accountId,
      username: user.username,
      online: true,
    });

    console.log(`User ${user.username} connected globally`);

    socket.on("disconnect", () => {
      console.log(`User ${user.username} disconnected globally`);
      io.emit("presence", {
        type: "presence",
        user_id: user.accountId,
        username: user.username,
        online: false,
      });
    });
  });
};
