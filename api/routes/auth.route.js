import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import sendConfirmationEmail from "../middleware/sendConfirmationEmail.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// POST /register → crée un nouvel utilisateur (avec avatar optionnel)
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone, age, where } = req.body;

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

    const url = `${process.env.FRONT_URL}/verify-email?token=${token}`;
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

// POST /login-cookie → vérifie la validité du cookie de session et renvoie l'utilisateur
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
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Disconnected" });
});

// GET /verify-email → active le compte utilisateur via le token reçu par email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "Bad request !" });
    }
    user.isActive = true;
    await user.save();
    return res.json({ message: "Votre compte est activé" });
  } catch (err) {
    return res.status(500).json({ message: "Error server verify-email", err });
  }
});

export default router;