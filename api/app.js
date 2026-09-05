import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', authRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connexion établie avec succès !");
    app.listen(PORT, () => console.log(`Le serveur tourne sur le port : ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });