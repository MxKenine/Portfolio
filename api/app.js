import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import adminRoute from './routes/admin.route.js';
import cvRoute from './routes/cv.route.js';
import projetsRoute from './routes/projets.route.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const FRONT_URL = process.env.FRONT_URL;

app.use(cors({
  origin: FRONT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', authRoute);
app.use('/', adminRoute);
app.use('/', cvRoute);
app.use('/', projetsRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connexion établie avec succès !");
    app.listen(PORT, () => console.log(`Le serveur tourne sur le port : ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });