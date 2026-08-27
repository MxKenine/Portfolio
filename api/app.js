import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express()

const PORT = process.env.PORT || 3000 

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.use('', authRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connexion établie avec succès !")
        app.listen(PORT, () => console.log(`Le serveur tourne sur le port : ${PORT}`))
    })
    .catch(err => {
        console.log(err)
    })