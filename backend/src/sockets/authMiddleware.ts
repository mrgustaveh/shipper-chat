import { Server } from "socket.io";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../config/prisma";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const socketAuthMiddleware = async (
  socket: any,
  next: (err?: Error) => void,
) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    console.log("Socket Auth: Missing token");
    return next(new Error("Authentication error: Missing token"));
  }

  try {
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("Socket Auth: CLERK_SECRET_KEY not defined");
    }

    const sessionClaims = await clerk.verifyToken(token);

    const user = await prisma.account.findUnique({
      where: { clerkId: sessionClaims.sub },
    });

    if (!user) {
      console.log(
        `Socket Auth: User not found for clerkId ${sessionClaims.sub}`,
      );
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket Auth Error Detailed:", err);
    next(new Error("Authentication error"));
  }
};
