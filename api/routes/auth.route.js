const User = require('../models/user.model')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('', async (req, res) => {
    const { username, email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez remplir les champs" })
    }
    const userExist = await User.findOne({ email })
    if (userExist) {
        return res.status(400).json({ message: "Cet email existe déjà" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hash })
    res.status(201).json({ message: "L'utilisateur a été ajouté" })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez remplir les champs" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Identifiants invalides" })
    }
    const isMatch = await bcrypt.compare(password, User.password)
    if (!isMatch) {
        return res.status(400).json({ message: "Identifiants invalides" })
    }
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    )
    res.json(isMatch)
})

module.exports = router


// import User from "../models/user.model.js"
// import bcrypt from 'bcrypt'
// import express from 'express'
// import jwt from 'jsonwebtoken'
// import verfyToken from "../middleware/verifyToken.js"
// import multer from "multer"
// import path from 'path'
// import nodemailer from 'nodemailer'

// const router = express.Router()

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// })

// async function sendConfirmationEmail(destinataire) {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: destinataire,
//         subject: 'Confirmer votre adresse mail',
//         html: `
//             <h1>Bienvenue sur notre site</h1>
//             <p>Veuillez cliquer sur le lien
//             <a href="http:/localhost:5173">Cliquez ici</a>
//             </p>
//         `

//     }
//     try {
//         await transporter.sendMail(mailOptions)
//         console.log('email envoyé')
//     } catch (err) {
//         console.log(err)
//     }
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         // const uniqueName = Date.now() + path.extname(file.originalname)
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage })

// router.post('/register', upload.single('image'), async (req, res) => {
//     try {
//         const imageFile = req.file
//         const { username, email, password, role } = req.body
//         const user = await User.findOne({ email })
//         if (user) {
//             return res.status(400).json({ message: 'Cet utilisateur existe déjà' })
//         }
//         const hash = await bcrypt.hash(password, 10)

//         const imageName = imageFile ? imageFile.filename : null

//         await User.create({ username, email, password: hash, role, image: imageName })
//         res.status(201).json({ message: 'Utilisateur crée !' })
//     } catch (err) {
//         res.status(500).json({ message: err })
//     }
// })

// router.post('/login-localstorage', async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await User.findOne({ email })
//         if (!user) {
//             return res.status(400).json({ message: 'Invalides identifiants' })
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalides identifiants' })
//         }
//         const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET)
//         res.status(200).json({ token, role: user.role })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: err })
//     }
// })

// router.post('/login-cookie', async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (!email || !password) {
//             return res.status(400).json({ message: "Les champs sont requis" })
//         }
//         const user = await User.findOne({ email })
//         if (!user) {
//             return res.status(400).json({ message: "Identifiants Invalides" })
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if (!isMatch) {
//             return res.status(400).json({ message: "Identifiants Invalides" })
//         }
//         const token = jwt.sign(
//             {
//                 userID: user._id,
//                 username: user.username,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "2h" })
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: false,
//             maxAge: 3600 * 1000 * 2
//         })
//         res.status(200).json({ message: "Connexion réussie !" })
//     } catch (err) {
//         res.status(500).json({ message: err })

//     }
// })

// router.get('/admin', verfyToken, async (req, res) => {
//     console.log(req.user)
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ message: "Accées refusé" })
//     }
//     const users = await User.find()
//     res.status(200).json(users)
// })

// router.get('/profile', verfyToken, async (req, res) => {
//     const user = await User.findById(req.user.id)
//     res.status(200).json(user)
// })

// export default router