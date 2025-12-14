import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  images: [String],
});

export const Service = mongoose.model("Service", ServiceSchema);
