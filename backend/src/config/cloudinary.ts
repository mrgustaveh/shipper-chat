import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "chat-media",
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "gif",
        "pdf",
        "docx",
        "doc",
        "mp4",
        "mov",
        "mp3",
        "wav",
        "webm",
        "ogg",
      ],
      resource_type: "auto",
    };
  },
});

export const upload = multer({ storage: storage });
export { cloudinary };
