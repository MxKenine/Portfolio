import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express()

const BACK_URL = process.env.VITE_BACK_URL || 3000 

app.use(cors({
    origin:process.env.FRONT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.use('', authRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connexion établie avec succès !")
        app.listen(BACK_URL, () => console.log(`Le serveur tourne sur le port : ${BACK_URL}`))
    })
    .catch(err => {
        console.log(err)
    })