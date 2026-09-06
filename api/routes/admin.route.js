import express from "express";
import fs from "fs";

import User from "../models/user.model.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET /admin → renvoie les infos de l'admin connecté (accès réservé au rôle admin)
router.get("/admin", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json({ message: "Bienvenue admin", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/profil → renvoie les infos de l'admin connecté
router.get("/admin/profil", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/profil → met à jour les infos de l'admin connecté (+ avatar optionnel)
router.patch(
  "/admin/profil",
  verifyToken,
  verifyRole("admin"),
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { firstname, lastname, email, phone, where, age } = req.body;
      const updateData = { firstname, lastname, email, phone, where, age };

      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      const oldAvatarPath = currentUser.avatar;

      if (req.file) {
        updateData.avatar = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { returnDocument: "after", runValidators: true }
      ).select("-password");

      if (req.file && oldAvatarPath) {
        fs.unlink(oldAvatarPath, (err) => {
          if (err) {
            console.error("Erreur suppression ancien avatar :", err.message);
          }
        });
      }

      res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default router;