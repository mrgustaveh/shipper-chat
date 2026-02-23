import { Router } from "express";
import { userController } from "../controllers/userController";
import { clerkAuth } from "../middleware/auth";

const router = Router();

router.use(clerkAuth);

router.post("/", userController.createOrUpdateAccount);
router.get("/me", userController.getProfile);
router.get("/list", userController.listUsers);
router.get("/:id", userController.retrieveUser);

export default router;
