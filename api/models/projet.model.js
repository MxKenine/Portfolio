// projet.model.js
import mongoose from "mongoose";

const projetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, default: "" },
  link: { type: String, default: "" },
});

export default mongoose.model("Projet", projetSchema);