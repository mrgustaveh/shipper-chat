import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../config/prisma";
import { createClerkClient } from "@clerk/clerk-sdk-node";

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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const sessionClaims = await clerk.verifyToken(token);
      const clerkId = sessionClaims.sub;

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
      res.status(401).json({ error: "invalid token" });
    }
  },
};
