import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";
import userRoutes from "./routes/user";
import mediaRoutes from "./routes/media";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.includes(",")
        ? process.env.CORS_ORIGIN.split(",")
        : process.env.CORS_ORIGIN
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/media", mediaRoutes);

app.use(errorHandler);

export default app;
