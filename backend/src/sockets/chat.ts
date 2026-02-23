import { Server, Socket } from "socket.io";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const setupChatSockets = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token as string;
    if (!token) return next(new Error("Authentication error: Missing token"));

    try {
      const sessionClaims = await clerk.verifyToken(token);

      const user = await prisma.account.findUnique({
        where: { clerkId: sessionClaims.sub },
      });

      if (!user) return next(new Error("User not found"));

      (socket as any).user = user;
      next();
    } catch (err) {
      console.error("Socket Auth Error:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as any).user;
    const { chatId } = socket.handshake.query as { chatId: string };

    if (!chatId) {
      socket.disconnect();
      return;
    }

    const roomName = `chat_${chatId}`;
    let hasAccess = false;
    try {
      const chat = await prisma.userChat.findUnique({
        where: { chatId },
      });
      hasAccess =
        chat?.user1Id === user.accountId || chat?.user2Id === user.accountId;
    } catch (error) {
      console.error("Access verification error:", error);
    }

    if (!hasAccess) {
      console.log(
        `Access denied for user ${user.username} to room ${roomName}`,
      );
      socket.disconnect();
      return;
    }

    socket.join(roomName);
    console.log(`User ${user.username} joined room ${roomName}`);

    io.to(roomName).emit("presence", {
      type: "presence",
      user_id: user.accountId,
      username: user.username,
      online: true,
    });

    socket.on("chat_message", async (data) => {
      const { text_content, media, links, docs } = data;

      const hasMedia = Array.isArray(media) && media.length > 0;
      const hasLinks = Array.isArray(links) && links.length > 0;
      const hasDocs = Array.isArray(docs) && docs.length > 0;

      if (!text_content && !hasMedia && !hasLinks && !hasDocs) {
        socket.emit("error", { message: "Message content is required" });
        return;
      }

      try {
        const message = await prisma.message.create({
          data: {
            senderId: user.accountId,
            textContent: text_content || "",
            media: hasMedia ? media : [],
            links: hasLinks ? links : [],
            docs: hasDocs ? docs : [],
            userChatId: chatId,
          },
        });

        io.to(roomName).emit("chat_message", {
          type: "chat_message",
          message_id: message.messageId,
          sender: {
            account_id: user.accountId,
            username: user.username,
            email: user.email,
            display_pic: user.displayPic,
            created: user.created.toISOString(),
          },
          text_content: message.textContent,
          media: message.media,
          links: message.links,
          docs: message.docs,
          created: message.created.toISOString(),
        });

        await prisma.userChat.update({
          where: { chatId },
          data: { updated: new Date() },
        });
      } catch (error) {
        console.error("Message save error:", error);
        socket.emit("error", { message: "failed to save message" });
      }
    });

    socket.on("typing", (data) => {
      socket.to(roomName).emit("typing", {
        type: "typing",
        user_id: user.accountId,
        username: user.username,
        is_typing: data.is_typing,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${user.username} left room ${roomName}`);
      io.to(roomName).emit("presence", {
        type: "presence",
        user_id: user.accountId,
        username: user.username,
        online: false,
      });
    });
  });
};
