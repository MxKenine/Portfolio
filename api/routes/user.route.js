const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

router.post('', async (req, res) => {
    try {
        const user = req.body
        await User.create(user)
        res.status(201).json({ message: 'User added successfully' })
    } catch (err) {
        console.log('Erreur lors de la sauvegarde', err)
        res.status(500).json(err)
    }
})

router.get('', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

router.put('/:id', async (req, res) => {
    try {
        const user = req.body
        const id = req.params.id
        const userUpdate = await User.findByIdAndUpdate(id, user, { new: true })
        res.json(userUpdate)
        res.json({ message: 'User Updated' })
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})

router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User removed' })
})

module.exports = router