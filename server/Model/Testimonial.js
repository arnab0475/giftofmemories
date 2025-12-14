import mongoose from "mongoose";
const TestimonialSchema = new mongoose.Schema({
  name: String,
  feedback: String,
  rating: Number,
  image: String
});
export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
