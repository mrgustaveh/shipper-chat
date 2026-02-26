import { Response } from "express";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../config/prisma";

const SYSTEM_PROMPT = `You are ShipperChat AI, a helpful assistant integrated into a real-time messaging platform. You can help users with:
- General questions and conversations
- Writing and composing messages
- Summarizing information
- Providing suggestions and recommendations
- Any other helpful tasks

Keep your responses concise, friendly, and well-formatted using markdown when appropriate.`;

export const aiController = {
  // List all conversations for the authenticated user
  listConversations: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversations = await prisma.aiConversation.findMany({
        where: { accountId: req.user.accountId },
        orderBy: { updated: "desc" },
        include: {
          messages: {
            orderBy: { created: "asc" },
          },
        },
      });

      res.json(conversations);
    } catch (error) {
      console.error("List AI conversations error:", error);
      res.status(500).json({ error: "Failed to list conversations" });
    }
  },

  // Create a new conversation
  createConversation: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title } = req.body;

      const conversation = await prisma.aiConversation.create({
        data: {
          accountId: req.user.accountId,
          title: title || "New Chat",
        },
        include: { messages: true },
      });

      res.status(201).json(conversation);
    } catch (error) {
      console.error("Create AI conversation error:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  },

  // Delete a conversation
  deleteConversation: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Verify ownership
      const conversation = await prisma.aiConversation.findUnique({
        where: { id },
      });

      if (!conversation || conversation.accountId !== req.user.accountId) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      await prisma.aiConversation.delete({ where: { id } });

      res.json({ success: true });
    } catch (error) {
      console.error("Delete AI conversation error:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  },

  // Stream AI chat and persist messages
  chat: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { messages, conversationId } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res
          .status(400)
          .json({ error: "Messages array is required and cannot be empty" });
      }

      if (!conversationId) {
        return res.status(400).json({ error: "conversationId is required" });
      }

      // Verify conversation ownership
      const conversation = await prisma.aiConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation || conversation.accountId !== req.user.accountId) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Get the latest user message (last in the array)
      const latestUserMessage = messages[messages.length - 1];

      // Save the user message to DB
      await prisma.aiMessage.create({
        data: {
          conversationId,
          role: "user",
          content: latestUserMessage.content,
        },
      });

      // Auto-title: if this is the first message, set title from it
      const messageCount = await prisma.aiMessage.count({
        where: { conversationId },
      });

      if (messageCount === 1) {
        const title =
          latestUserMessage.content.length > 50
            ? latestUserMessage.content.substring(0, 50) + "..."
            : latestUserMessage.content;

        await prisma.aiConversation.update({
          where: { id: conversationId },
          data: { title },
        });
      }

      const result = streamText({
        model: groq("llama-3.1-8b-instant"),
        system: SYSTEM_PROMPT,
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      });

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Transfer-Encoding", "chunked");

      let fullResponse = "";

      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        res.write(chunk);
      }

      // Save the assistant response to DB
      await prisma.aiMessage.create({
        data: {
          conversationId,
          role: "assistant",
          content: fullResponse,
        },
      });

      // Update conversation timestamp
      await prisma.aiConversation.update({
        where: { id: conversationId },
        data: { updated: new Date() },
      });

      res.end();
    } catch (error) {
      console.error("AI chat error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process AI chat request" });
      }
    }
  },
};
