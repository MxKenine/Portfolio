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

// GET /cv/public → CV public de l'unique admin du site, sans coordonnées sensibles
// (email/téléphone sont exclus par défaut, révélés uniquement via /cv/public/contact)
router.get("/cv/public", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Administrateur introuvable" });
    }

    const cv = await CV.findOne({ user: admin._id }).populate(
      "user",
      "firstname lastname where avatar" // pas d'email ni de phone ici
    );
    if (!cv) return res.status(404).json({ message: "CV introuvable" });

    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /cv/public/contact → révèle l'email et le téléphone de l'admin à la demande
router.get("/cv/public/contact", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }, "email phone");
    if (!admin) {
      return res.status(404).json({ message: "Administrateur introuvable" });
    }
    res.json({ email: admin.email, phone: admin.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;