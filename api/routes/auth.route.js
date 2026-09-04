import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

import User from "../models/user.model.js";
import CV from "../models/cv.model.js"
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import sendConfirmationEmail from "../middleware/sendConfirmationEmail.js";
import Projet from "../models/projet.model.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone, age, where } =
      req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez remplir les champs" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }
    const hash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const avatarPath = req.file ? req.file.path : null;

    await User.create({
      email,
      password: hash,
      firstname,
      lastname,
      phone,
      age,
      where,
      role: "user",
      token,
      avatar: avatarPath,
    });
    const url = `http://localhost:5173/verify-email?token=${token}`;
    sendConfirmationEmail(email, url);
    res.status(201).json({ message: "L'utilisateur a été ajouté" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez remplir les champs" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const userPayload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET n'est pas défini");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: userPayload,
      role: user.role,
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer" });
  }
});

router.get("/admin", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ message: "Bienvenue admin", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch(
  "/admin/edit-profil/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { firstname, lastname, email, phone, where, age, role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstname, lastname, email, phone, where, age, role },
        { returnDocument: 'after', runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

router.post("/login-cookie", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Session valide", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Disconnected" });
});

router.get("/verify-email", async (req, res) => {
  try {
    //Récupération du token depuis l'URL
    const { token } = req.query;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "Bad request !" });
    } else {
      user.isActive = true;
      await user.save();
      return res.json({ message: "Votre compte est activé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error server verify-email", err });
  }
});

router.get("/cv/:userId", verifyToken, async (req, res) => {
  try {
    const cv = await CV.findOne({ user: req.params.userId });
    if (!cv) return res.status(404).json({ message: "CV introuvable" });
    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/cv/:userId", verifyToken, async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: "CV mis à jour", cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Liste publique — jamais d'email/téléphone en clair
router.get("/members", async (req, res) => {
  try {
    const users = await User.find({}, "firstname lastname avatar where");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Révélation à la demande, un utilisateur à la fois
router.get("/members/:id/contact", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "email phone");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/cvs", async (req, res) => {
  try {
    const cvs = await CV.find({}); // tout est public ici, pas de champ sensible dans le CV
    res.json({ cvs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/members/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "firstname lastname avatar");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/projets", async (req, res) => {
  try {
    const projets = await Projet.find({});
    res.json({ projets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
