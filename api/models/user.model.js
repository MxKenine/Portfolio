// Importer le module mongoose
const mongoose = require('mongoose')

// Définir le schéma
const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, minLenght: 8 }
}, { timestamps: true }) // Ajouter deux propriétés: createdAt et updatedAt

// Créer le model à partir du schéma
const User = mongoose.model('User', userSchema)

// Exporter User pour l'utiliser dans d'autres fichiers
module.exports = User


// const mongoose = require('mongoose')

// const userSchema = mongoose.Schema({
//     username: {
//         type: String
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 8
//     }
// })

// const User = mongoose.model('users', userSchema)
// module.exports = User


// const mongoose = require('mongoose')
// const userSchema = new mongoose.Schema({
//     username: { type: String },
//     email: { type: String, require: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, require: true, minlenght: 3, trim: true },
//     isActive: { type: Boolean, default: false }
// }, { timestamps: true })

// const User = mongoose.model('users', userSchema)
// module.exports = User


// import mongoose from 'mongoose'

// const userSchema = new mongoose.Schema({
//     username: { type: String },
//     email: { type: String, unique: true, required: true, lowercase: true, trim: true },
//     password: { type: String, minLength: 8, trim: true },
//     role: { type: String, required: true},
//     isActive: { type: Boolean, default: false }
// })

// const User = mongoose.model('user', userSchema)
// export default User