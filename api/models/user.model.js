// Importer le module mongoose
import mongoose from 'mongoose'

// Définir le schéma
const userSchema = new mongoose.Schema({
    firstName: {type: String},
    LastName: {type: String},
    avatar: {type: String},
    phone: {type: String},
    where: {type : String},
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minLenght: 6 },
    role: { type: String, enum: ["user", "admin"], required: true},
    isActive: { type: Boolean, default: false },
    token: {type: String, required: true}
}, { timestamps: true }) // Ajouter deux propriétés: createdAt et updatedAt

// Créer le model à partir du schéma
const User = mongoose.model('User', userSchema)

// Exporter User pour l'utiliser dans d'autres fichiers
export default User