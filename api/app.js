import cors from 'cors';
import authRoute from './routes/auth.route.js';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

const app = express()

const PORT = process.env.PORT || 3000 

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('', authRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connexion établie avec succès !")
        app.listen(PORT, () => console.log(`Le serveur tourne sur le port : ${PORT}`))
    })
    .catch(err => {
        console.log(err)
    })