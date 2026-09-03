import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Intitulé du poste
  company: { type: String, required: true },     // Nom de l'entreprise
  startDate: { type: String, required: true },    // ex: "2024"
  endDate: { type: String, default: "Actuellement" },
  description: { type: String, default: "" },
  tags: [{ type: String }],                       // ex: ["React", "Node.js"]
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 50 }, // en %
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 3, default: 1 },    // pastilles 0-3
  label: { type: String, default: "" },                    // ex: "Langue maternelle"
});

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullname: { type: String, required: true },
    title: { type: String, default: "" },        // ex: "Développeur Full Stack"
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    links: [{ type: String }],
    photo: { type: String, default: "" },

    experiences: [experienceSchema],
    skills: [skillSchema],
    languages: [languageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CV", cvSchema);