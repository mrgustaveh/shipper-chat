import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";

export const mediaController = {
  uploadFile: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      res.json({
        url: req.file.path,
        original_name: req.file.originalname,
        format: req.file.mimetype,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  },
};
