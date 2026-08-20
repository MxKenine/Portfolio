const express = require('express')
const router = express.Router()
const Formation = require('../models/formation.model')

router.post('', async (req, res) => {
    try {
        const formation = req.body
        await Formation.create(formation)
        res.status(201).json({ message: 'Formation added successfully' })
    } catch (err) {
        console.log('Erreur lors de la sauvegarde', err)
        res.status(500).json(err)
    }
})

router.get('', async (req, res) => {
    const formations = await Formation.find()
    res.json(formations)
})

router.put('/:id', async (req, res) => {
    try {
        const user = req.body
        const id = req.params.id
        const formationUptdate = await Formation.findByIdAndUpdate(id, user, { new: true })
        res.json(formationUptdate)
        res.json({ message: 'Formation Updated' })
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})

router.delete('/:id', async (req, res) => {
    await Formation.findByIdAndDelete(req.params.id)
    res.json({ message: 'Formation removed' })
})

module.exports = router