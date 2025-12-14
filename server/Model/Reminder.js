import mongoose from "mongoose";
const ReminderSchema = new mongoose.Schema(
  {
    customerName: String,
    eventType: String,
    eventDate: String,
    number: String,
    message: String,
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);
export const Reminder = mongoose.model("Reminder", ReminderSchema);
