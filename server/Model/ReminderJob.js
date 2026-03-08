import mongoose from 'mongoose';

const reminderJobSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  days_before: { type: Number, required: true },
  send_time: { type: String, required: true }, 
  message: { type: String },
  image: { type: String },
  recipient_name: { type: String },
  recipient_phone: { type: String },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  sent_at: { type: Date }
}, { timestamps: true });

export default mongoose.model('ReminderJob', reminderJobSchema);