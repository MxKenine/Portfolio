import express from "express";

import CV from "../models/cv.model.js";
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

// GET /cvs → liste publique de tous les CV
router.get("/cvs", async (req, res) => {
  try {
    const cvs = await CV.find({});
    res.json({ cvs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /cv/public/:userId → CV public d'un utilisateur, enrichi des infos de profil
router.get("/cv/public/:userId", async (req, res) => {
  try {
    const cv = await CV.findOne({ user: req.params.userId }).populate(
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