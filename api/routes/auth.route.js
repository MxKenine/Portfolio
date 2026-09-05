import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import User from "../models/user.model.js";
import CV from "../models/cv.model.js"
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import sendConfirmationEmail from "../middleware/sendConfirmationEmail.js";
import Projet from "../models/projet.model.js";

const router = express.Router();

// Configuration de multer pour l'upload de fichiers (avatars)
// Les fichiers sont stockés dans le dossier "uploads/" à la racine du serveur
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // Nom de fichier unique basé sur le timestamp + extension d'origine
    // (évite les collisions de noms de fichiers)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /register → crée un nouvel utilisateur (avec avatar optionnel)
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone, age, where } =
      req.body;

    // Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez remplir les champs" });
    }

    // Empêche la création d'un compte avec un email déjà utilisé
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    // Hash du mot de passe avant stockage (jamais en clair en base)
    const hash = await bcrypt.hash(password, 10);

    // Token unique utilisé pour la vérification d'email
    const token = crypto.randomBytes(32).toString("hex");

    // Chemin du fichier avatar uploadé (null si aucun fichier envoyé)
    const avatarPath = req.file ? req.file.path : null;

    await User.create({
      email,
      password: hash,
      firstname,
      lastname,
      phone,
      age,
      where,
      role: "user", // rôle par défaut à l'inscription
      token,
      avatar: avatarPath,
    });

    // Envoi d'un email de confirmation avec lien de vérification
    const url = `http://localhost:5173/verify-email?token=${token}`;
    sendConfirmationEmail(email, url);

    res.status(201).json({ message: "L'utilisateur a été ajouté" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /login → authentifie un utilisateur et pose un cookie JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez remplir les champs" });
    }

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparaison du mot de passe fourni avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Données renvoyées au frontend (sans info sensible)
    const userPayload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    // Sécurité : on s'assure que la variable d'environnement critique existe
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET n'est pas défini");
    }

    // Génération du token JWT (contient l'id et le rôle de l'utilisateur)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" },
    );

    // Le token est stocké dans un cookie httpOnly (inaccessible en JS côté client, protège contre le XSS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // cookie envoyé en HTTPS uniquement en prod
      sameSite: "strict",
      maxAge: 3600000, // 1h de validité pour le cookie
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

// GET /admin → renvoie les infos de l'admin connecté (accès réservé au rôle admin)
router.get("/admin", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    // req.user.id est injecté par le middleware verifyToken après décodage du JWT
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json({ message: "Bienvenue admin", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/edit-profil/:id → modifie un utilisateur par son id
// (route historique, à conserver uniquement si un usage la nécessite encore ;
// sinon /admin/profil ci-dessous suffit puisqu'il n'y a qu'un seul admin)
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

// POST /login-cookie → vérifie la validité du cookie de session et renvoie l'utilisateur
// (utile pour restaurer une session côté frontend au chargement de l'app)
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

// POST /logout → déconnecte l'utilisateur en supprimant le cookie de session
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // date passée = expiration immédiate du cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Disconnected" });
});

// GET /verify-email → active le compte utilisateur via le token reçu par email
router.get("/verify-email", async (req, res) => {
  try {
    // Récupération du token depuis l'URL (query param)
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

// GET /cv/me → renvoie le CV de l'admin connecté (identifié via le token, pas via un :id dans l'URL)
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
      {
        returnDocument: 'after', // renvoie le document après mise à jour
        upsert: true,            // crée le CV s'il n'existe pas encore
        runValidators: true,     // applique les validations du schéma Mongoose
      }
    );
    res.json({ message: "CV mis à jour", cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /members → liste publique des membres (visiteurs du site)
// Aucune donnée sensible (email, téléphone) n'est jamais exposée ici
router.get("/members", async (req, res) => {
  try {
    const users = await User.find({}, "firstname lastname avatar where");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /members/:id/contact → révèle les coordonnées d'un membre à la demande
// (évite d'exposer email/téléphone en clair sur la liste publique générale)
router.get("/members/:id/contact", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "email phone");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /cvs → liste publique de tous les CV
router.get("/cvs", async (req, res) => {
  try {
    const cvs = await CV.find({}); // tout est public ici, pas de champ sensible dans le CV
    res.json({ cvs });
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

// GET /admin/profil → renvoie les infos de l'admin connecté
// (route dédiée à la page "Profil" de l'admin, séparée de /admin pour plus de clarté sémantique)
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

      // Récupère l'utilisateur actuel pour connaître son ancien avatar avant modification
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

      // Si un nouvel avatar a été uploadé et qu'un ancien existait, on supprime l'ancien fichier
      if (req.file && oldAvatarPath) {
        fs.unlink(oldAvatarPath, (err) => {
          if (err) {
            // On log l'erreur sans bloquer la réponse : la mise à jour du profil a déjà réussi
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

// GET /cv/public/:userId → CV public d'un utilisateur, enrichi des infos de profil
// (populate ramène firstname/lastname/email/phone/where/avatar depuis le modèle User,
// car ces infos ne sont plus dupliquées dans le modèle CV)
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