const express = require('express')
const pool = require('../db')
const router = express.Router()

router.get('/commands', async (req, res)=>{
    try {
        const [commands] = await pool.query('SELECT * FROM commands')
        console.log(commands)
        res.json({message:commands})
    } catch(error) {
        res.status(500).json({message:'Erreur de récupération des données'})
    }
})
router.post('/commands', async (req, res)=>{
    try {
        const {prix,client_id} = req.body
        const prix_dec = parseFloat(prix)
        await pool.query("INSERT INTO commands (prix,client_id) VALUES(?,?)", [prix_dec,client_id])
        console.log(prix,client_id)
        res.json({message:prix_dec,client_id})
    } catch(error) {
        res.status(500).json({message:"Erreur de l'ajout de la commande"})

    }
})
router.get('/commands/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    const client = await pool.query(`SELECT * FROM clients WHERE id = ${client_id}`)
    res.json({message:client})
})
router.put('/commands/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    const {nom} = req.body
    await pool.query('UPDATE clients SET nom=? WHERE id = ?', [nom,client_id])
    res.json({message:"Un client à été modifié"})
})
router.delete('/commands/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    pool.query('DELETE FROM clients WHERE id = ?', [client_id])
    res.json({message:"Client supprimé"})
})

module.exports = router