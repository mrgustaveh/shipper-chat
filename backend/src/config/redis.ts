import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl);

redis.on("error", (err) => {
  console.error("redis error:", err);
});

redis.on("connect", () => {
  console.log("connected to redis");
});

export default redis;
