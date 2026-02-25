import { Server, Socket } from "socket.io";
import prisma from "../config/prisma";

export const setupChatSockets = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    const user = (socket as any).user;
    const { chatId } = socket.handshake.query as { chatId: string };

    let roomName: string | null = null;

    if (chatId) {
      roomName = `chat_${chatId}`;
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

      if (hasAccess) {
        socket.join(roomName);
        console.log(`User ${user.username} joined room ${roomName}`);
      } else {
        console.log(
          `Access denied for user ${user.username} to chat ${chatId}`,
        );
        socket.emit("error", { message: "Access denied to this chat" });
        roomName = null;
      }
    }

    socket.on("chat_message", async (data) => {
      if (!chatId || !roomName) return;
      const { text_content, media, links, docs, voiceUrl } = data;

      const hasMedia = Array.isArray(media) && media.length > 0;
      const hasLinks = Array.isArray(links) && links.length > 0;
      const hasDocs = Array.isArray(docs) && docs.length > 0;

      if (!text_content && !hasMedia && !hasLinks && !hasDocs && !voiceUrl) {
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
            voiceUrl: voiceUrl || null,
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
          voice_url: message.voiceUrl,
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
      if (!roomName) return;
      socket.to(roomName).emit("typing", {
        type: "typing",
        user_id: user.accountId,
        username: user.username,
        is_typing: data.is_typing,
      });
    });

    socket.on("disconnect", () => {
      if (roomName) {
        console.log(`User ${user.username} left room ${roomName}`);
      }
    });
  });
};
