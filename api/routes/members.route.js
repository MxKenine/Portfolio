import express from "express";

import User from "../models/user.model.js";

const router = express.Router();

// GET /members → liste publique des membres
router.get("/members", async (req, res) => {
  try {
    const users = await User.find({}, "firstname lastname avatar where");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /members/:id/contact → révèle les coordonnées d'un membre à la demande
router.get("/members/:id/contact", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "email phone");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /members/:id → infos publiques d'un membre précis
router.get("/members/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "firstname lastname avatar");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;