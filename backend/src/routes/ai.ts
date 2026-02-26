import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { clerkAuth, requireAccount } from "../middleware/auth";

const router = Router();

router.use(clerkAuth);
router.use(requireAccount);

router.get("/conversations", aiController.listConversations);
router.post("/conversations", aiController.createConversation);
router.delete("/conversations/:id", aiController.deleteConversation);
router.post("/chat", aiController.chat);

export default router;
