import { Router } from "express";
import { chatController } from "../controllers/chatController";
import { clerkAuth, requireAccount } from "../middleware/auth";

const router = Router();

router.use(clerkAuth);
router.use(requireAccount);

router.get("/user-chats", chatController.listUserChats);
router.post("/user-chats", chatController.createUserChat);
router.patch("/user-chats/:chatId/archive", chatController.archiveUserChat);
router.patch("/user-chats/:chatId/read", chatController.markChatRead);
router.delete("/user-chats/:chatId", chatController.deleteUserChat);
router.get("/messages", chatController.listMessages);

export default router;
