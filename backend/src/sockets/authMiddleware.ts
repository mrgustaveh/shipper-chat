import { Server } from "socket.io";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const socketAuthMiddleware = async (
  socket: any,
  next: (err?: Error) => void,
) => {
  const token = socket.handshake.query.token as string;
  if (!token) return next(new Error("Authentication error: Missing token"));

  try {
    const sessionClaims = await clerk.verifyToken(token);

    const user = await prisma.account.findUnique({
      where: { clerkId: sessionClaims.sub },
    });

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket Auth Error:", err);
    next(new Error("Authentication error"));
  }
};
