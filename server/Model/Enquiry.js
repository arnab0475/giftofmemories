import mongoose from "mongoose";
const EnquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    source: String,
  },
  {
    timestamps: true,
  }
);
export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
