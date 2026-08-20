const mongoose = require('mongoose')

const formationSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    date: { type: String },
    etablissement: { type: String },
    description: { type: String }
})

const Formation = mongoose.model('Formation', formationSchema)

module.exports = Formation