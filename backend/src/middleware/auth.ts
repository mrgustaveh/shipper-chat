import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const clerkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sessionClaims = await clerk.verifyToken(token);
    const clerkId = sessionClaims.sub;

    const account = await prisma.account.findUnique({
      where: { clerkId },
    });

    if (!account) {
      return res.status(401).json({ error: "Account not found" });
    }

    req.user = account;
    next();
  } catch (error) {
    console.error("clerk auth error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
