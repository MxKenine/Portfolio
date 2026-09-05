import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "Actuellement" },
  description: { type: String, default: "" },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 50 },
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 6, default: 1 },
  label: { type: String, default: "" },
});

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    experiences: [experienceSchema],
    skills: [skillSchema],
    languages: [languageSchema],
  },
  { timestamps: true },
);

export default mongoose.model("CV", cvSchema);