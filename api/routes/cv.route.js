import express from "express";

import CV from "../models/cv.model.js";
import User from "../models/user.model.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// GET /cv/me → renvoie le CV de l'admin connecté
router.get("/cv/me", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const cv = await CV.findOne({ user: req.user.id });
    if (!cv) return res.status(404).json({ message: "CV introuvable" });
    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /cv/me → crée ou met à jour le CV de l'admin connecté
router.patch("/cv/me", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body, user: req.user.id },
      { returnDocument: "after", upsert: true, runValidators: true }
    );
    res.json({ message: "CV mis à jour", cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /cv/public → CV public de l'unique admin du site, enrichi des infos de profil
// (il n'y a qu'un seul utilisateur/CV possible, donc pas besoin de :userId)
router.get("/cv/public", async (req, res) => {
  try {
    // On retrouve l'admin (unique) plutôt que de dépendre d'un id dans l'URL
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Administrateur introuvable" });
    }

    const cv = await CV.findOne({ user: admin._id }).populate(
      "user",
      "firstname lastname email phone where avatar"
    );
    if (!cv) return res.status(404).json({ message: "CV introuvable" });

    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;