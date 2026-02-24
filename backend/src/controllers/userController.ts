import { Response } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const userController = {
  getProfile: async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
  },

  listUsers: async (req: AuthenticatedRequest, res: Response) => {
    const users = await prisma.account.findMany();
    res.json(users);
  },

  retrieveUser: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const user = await prisma.account.findUnique({
      where: { accountId: id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  },

  createOrUpdateAccount: async (req: AuthenticatedRequest, res: Response) => {
    const { username, displayPic, email } = req.body;
    const clerkId = req.clerkId;

    if (!clerkId)
      return res.status(401).json({ error: "clerkId not found in request" });

    try {
      const account = await prisma.account.upsert({
        where: { clerkId },
        update: {
          username,
          displayPic,
          email,
        },
        create: {
          clerkId,
          username,
          displayPic,
          email,
        },
      });

      res.json(account);
    } catch (error) {
      console.error("Account upsert error:", error);
      res.status(500).json({ error: "Failed to create or update account" });
    }
  },
};
