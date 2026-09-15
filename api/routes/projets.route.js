import express from "express";

import Projet from "../models/projet.model.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

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

// POST /projets → créer un projet (admin uniquement)
router.post(
  "/projets",
  verifyToken,
  verifyRole("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, link } = req.body;

      // FormData envoie un seul champ "tags" (string) ou plusieurs champs "tags" (array)
      // selon le nombre de tags ; on normalise dans tous les cas en tableau
      const tags = req.body.tags
        ? Array.isArray(req.body.tags)
          ? req.body.tags
          : [req.body.tags]
        : [];

      if (!title) {
        return res.status(400).json({ message: "Le titre est requis" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "L'image est requise" });
      }

      const projet = await Projet.create({
        title,
        description,
        link,
        tags,
        image: req.file.path,
      });

      res.status(201).json({ projet });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT /projets/:id → modifier un projet (admin uniquement)
router.put(
  "/projets/:id",
  verifyToken,
  verifyRole("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, link } = req.body;
      const tags = req.body.tags
        ? Array.isArray(req.body.tags)
          ? req.body.tags
          : [req.body.tags]
        : [];

      const update = { title, description, link, tags };
      if (req.file) {
        update.image = req.file.path; // remplace l'image seulement si une nouvelle a été envoyée
      }

      const projet = await Projet.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      });
      if (!projet) return res.status(404).json({ message: "Projet introuvable" });
      res.json({ projet });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE /projets/:id → supprimer un projet (admin uniquement)
router.delete("/projets/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) return res.status(404).json({ message: "Projet introuvable" });
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;