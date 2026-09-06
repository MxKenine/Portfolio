import multer from "multer";
import path from "path";

// Configuration de multer pour l'upload de fichiers (avatars)
// Les fichiers sont stockés dans le dossier "uploads/" à la racine du serveur
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });