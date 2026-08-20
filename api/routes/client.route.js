const express = require('express')
const pool = require('../db')
const router = express.Router()

router.get('/client', async (req, res)=>{
    const [clients] = await pool.query('SELECT * FROM clients')
    console.log(clients)
    res.json({message:clients})
})
router.post('/client', async (req, res)=>{
    const {nom} = req.body
    await pool.query("INSERT INTO clients (nom) VALUES(?)", [nom])
    res.json({message:"Un client à été ajouté"})
})
router.get('/client/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    const [client] = await pool.query(`SELECT * FROM clients WHERE id = ${client_id}`)
    res.json({message:client})
})
router.put('/client/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    const {nom} = req.body
    await pool.query('UPDATE clients SET nom=? WHERE id = ?', [nom,client_id])
    res.json({message:"Un client à été modifié"})
})
router.delete('/client/:id', async (req, res)=>{
    const {id} = req.params
    const client_id = Number(id)
    pool.query('DELETE FROM clients WHERE id = ?', [client_id])
    res.json({message:"Client supprimé"})
})

module.exports = router