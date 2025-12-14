import mongoose from "mongoose";
const GallerySchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ["image", "video"] },
  tags: [String]
});
export const Gallery = mongoose.model("Gallery", GallerySchema);
