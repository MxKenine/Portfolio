import express from 'express';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'
import { verifyToken, verifyRole } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Veuillez remplir les champs" })
        }
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "Cet email existe déjà" })
        }
        const hash = await bcrypt.hash(password, 10)
        const token = crypto.randomBytes(32).toString('hex')
        await User.create({ email, password: hash,  role:"user", token})
        res.status(201).json({ message: "L'utilisateur a été ajouté" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Veuillez remplir les champs" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides mail" })
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides mdp" })
        }
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        )
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        })
        res.status(200).json({ message: "Connexion réussi", role: user.role })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/admin', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const users = await User.find({}, '-password')
        res.json({ message: "Bienvenue admin", users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/admin/edit-profil', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const users = await User.find({}, '-password')
        res.json({ message: "Bienvenue admin", users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router