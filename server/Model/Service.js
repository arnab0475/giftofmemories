import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  title: String,
  category: String,
  shortDescription: String,
  description: String,
  price: String,
  images: [String],
  details: {
    duration: String,
    deliverables: String,
    location: String,
  },
});

export const Service = mongoose.model("Service", ServiceSchema);
