import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  event_date: { type: Date, required: true },
  event_type: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);