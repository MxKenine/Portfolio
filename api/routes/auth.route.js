const User = require('../models/user.model')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')

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
    res.json(isMatch)
})

module.exports = router