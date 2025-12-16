import mongoose from "mongoose";
const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
