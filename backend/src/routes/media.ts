import { Router } from "express";
import { mediaController } from "../controllers/mediaController";
import { clerkAuth } from "../middleware/auth";
import { upload } from "../config/cloudinary";

const router = Router();

router.use(clerkAuth);

router.post("/upload", upload.single("file"), mediaController.uploadFile);

export default router;
