// Importer le module mongoose
const mongoose = require('mongoose')

// Définir le schéma
const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minLenght: 6 },
    role: { type: String, enum: ["user", "admin"], required: true},
    isActive: { type: Boolean, default: false }
}, { timestamps: true }) // Ajouter deux propriétés: createdAt et updatedAt

// Créer le model à partir du schéma
const User = mongoose.model('User', userSchema)

// Exporter User pour l'utiliser dans d'autres fichiers
module.exports = User