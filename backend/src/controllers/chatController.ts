import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../config/prisma";

export const chatController = {
  listUserChats: async (req: AuthenticatedRequest, res: Response) => {
    const account = req.user;
    const includeArchived = req.query.include_archived === "true";

    const chats = await prisma.userChat.findMany({
      where: {
        OR: [
          {
            user1Id: account.accountId,
            ...(includeArchived ? {} : { user1Archived: false }),
          },
          {
            user2Id: account.accountId,
            ...(includeArchived ? {} : { user2Archived: false }),
          },
        ],
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: { created: "desc" },
          take: 1,
        },
      },
      orderBy: { updated: "desc" },
    });

    // Compute unread count for each chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const isUser1 = chat.user1Id === account.accountId;
        const lastReadAt = isUser1
          ? chat.user1LastReadAt
          : chat.user2LastReadAt;

        const unreadCount = await prisma.message.count({
          where: {
            userChatId: chat.chatId,
            senderId: { not: account.accountId },
            ...(lastReadAt ? { created: { gt: lastReadAt } } : {}),
          },
        });

        return { ...chat, unreadCount };
      }),
    );

    res.json(chatsWithUnread);
  },

  createUserChat: async (req: AuthenticatedRequest, res: Response) => {
    const account = req.user;
    const { user2Id } = req.body;

    if (!user2Id) {
      return res.status(400).json({ error: "user2Id is required" });
    }

    const existingChat = await prisma.userChat.findFirst({
      where: {
        OR: [
          { user1Id: account.accountId, user2Id: user2Id },
          { user1Id: user2Id, user2Id: account.accountId },
        ],
      },
    });

    if (existingChat) {
      return res.status(403).json({ error: "Chat already exists" });
    }

    const chat = await prisma.userChat.create({
      data: {
        user1Id: account.accountId,
        user2Id: user2Id,
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    res.status(201).json(chat);
  },

  listMessages: async (req: AuthenticatedRequest, res: Response) => {
    const account = req.user;
    const { user_chat } = req.query;

    if (user_chat) {
      const chat = await prisma.userChat.findFirst({
        where: {
          chatId: user_chat as string,
          OR: [{ user1Id: account.accountId }, { user2Id: account.accountId }],
        },
      });
      if (!chat) return res.status(403).json({ error: "Forbidden" });
      const messages = await prisma.message.findMany({
        where: { userChatId: user_chat as string },
        include: { sender: true },
        orderBy: { created: "asc" },
      });
      return res.json(messages);
    }

    const messages = await prisma.message.findMany({
      where: {
        userChat: {
          OR: [{ user1Id: account.accountId }, { user2Id: account.accountId }],
        },
      },
      include: { sender: true },
      orderBy: { created: "asc" },
    });
    res.json(messages);
  },

  archiveUserChat: async (req: AuthenticatedRequest, res: Response) => {
    const account = req.user;
    const { chatId } = req.params;
    const { archived } = req.body;

    if (typeof archived !== "boolean") {
      return res.status(400).json({ error: "'archived' boolean is required" });
    }

    const chat = await prisma.userChat.findUnique({ where: { chatId } });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isUser1 = chat.user1Id === account.accountId;
    const isUser2 = chat.user2Id === account.accountId;

    if (!isUser1 && !isUser2) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedChat = await prisma.userChat.update({
      where: { chatId },
      data: isUser1 ? { user1Archived: archived } : { user2Archived: archived },
      include: {
        user1: true,
        user2: true,
      },
    });

    res.json(updatedChat);
  },

  markChatRead: async (req: AuthenticatedRequest, res: Response) => {
    const account = req.user;
    const { chatId } = req.params;
    const { read } = req.body;

    if (typeof read !== "boolean") {
      return res.status(400).json({ error: "'read' boolean is required" });
    }

    const chat = await prisma.userChat.findUnique({ where: { chatId } });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isUser1 = chat.user1Id === account.accountId;
    const isUser2 = chat.user2Id === account.accountId;

    if (!isUser1 && !isUser2) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedChat = await prisma.userChat.update({
      where: { chatId },
      data: isUser1
        ? { user1LastReadAt: read ? new Date() : null }
        : { user2LastReadAt: read ? new Date() : null },
      include: {
        user1: true,
        user2: true,
      },
    });

    res.json(updatedChat);
  },
};
