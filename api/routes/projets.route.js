import express from "express";

import Projet from "../models/projet.model.js";

const router = express.Router();

// GET /projets → liste publique de tous les projets
router.get("/projets", async (req, res) => {
  try {
    const projets = await Projet.find({});
    res.json({ projets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /projets/:id → détail public d'un projet précis
router.get("/projets/:id", async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) return res.status(404).json({ message: "Projet introuvable" });
    res.json({ projet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;