import { Router } from "express";
import { userController } from "../controllers/userController";
import { clerkAuth, requireAccount } from "../middleware/auth";

const router = Router();

router.use(clerkAuth);

router.post("/", userController.createOrUpdateAccount);
router.get("/me", requireAccount, userController.getProfile);
router.get("/list", requireAccount, userController.listUsers);
router.get("/:id", requireAccount, userController.retrieveUser);

export default router;
