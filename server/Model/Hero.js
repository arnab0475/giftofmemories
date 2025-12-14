import mongoose from "mongoose";
const HeroSchema = new mongoose.Schema({
  image: String,
  title: String,
  subtitle: String,
  buttonText: String,
  buttonLink: String
});
export const Hero = mongoose.model("Hero", HeroSchema);