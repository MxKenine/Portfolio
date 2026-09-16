import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // limite la taille max des images uploadées
    transformation: [{ width: 1600, height: 1600, crop: "limit" }],
  },
});

export const upload = multer({ storage });