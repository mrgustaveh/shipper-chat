import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export interface AuthenticatedRequest extends Request {
  user?: any;
  clerkId?: string;
}

export const clerkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided in Authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY is not defined in environment");
    }

    const sessionClaims = await clerk.verifyToken(token);
    const clerkId = sessionClaims.sub;
    req.clerkId = clerkId;

    const account = await prisma.account.findUnique({
      where: { clerkId },
    });

    if (account) {
      req.user = account;
    }

    next();
  } catch (error) {
    console.error("Clerk auth error detailed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireAccount = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    console.log(`Account required but none found for clerkId: ${req.clerkId}`);
    return res.status(401).json({ error: "Account not found" });
  }
  next();
};
