import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

import User from "../models/user.model.js";
import { verifyToken, verifyRole } from "../middleware/verifyToken.js";
import sendConfirmationEmail from "../middleware/sendConfirmationEmail.js";

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
    const { email, password, firstName, lastName, phone, age, where } =
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
      firstName,
      lastName,
      phone,
      age,
      where,
      role: "user",
      token,
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
      return res.status(400).json({ message: "Identifiants invalides mail" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides mdp" });
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
    res.status(200).json({ message: "Connexion réussi", role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
  "/admin/edit-profil",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const users = await User.find({}, "-password");
      res.json({ message: "Bienvenue admin", users });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

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

export default router;
