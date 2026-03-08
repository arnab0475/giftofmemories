import Booking from '../Model/Booking.js';
import ReminderJob from '../Model/ReminderJob.js';
import Template from '../Model/Template.js';

export const createBooking = async (req, res) => {
  try {
    const { customer_name, phone, event_date, event_type, reminders } = req.body;

    if (!customer_name || !phone || !event_date) {
      return res.status(400).json({ error: 'Name, phone, and event date are required' });
    }

    let reminderList = [];
    try {
      reminderList = JSON.parse(reminders || '[]');
    } catch (e) {
      return res.status(400).json({ error: 'Invalid reminders format' });
    }

    const newBooking = await Booking.create({
      customer_name,
      phone,
      event_date,
      event_type: event_type || 'General'
    });

    let scheduledCount = 0;
    for (const rem of reminderList) {
      if (rem.active) {
        const file = req.files && req.files.find(f => f.fieldname === `image_${rem.days_before}`);
        const imagePath = file ? file.filename : null;

        await ReminderJob.create({
          booking_id: newBooking._id,
          days_before: rem.days_before,
          send_time: rem.send_time || '09:00',
          message: rem.message || '',
          image: imagePath,
          recipient_name: customer_name,
          recipient_phone: phone,
          status: 'pending'
        });
        scheduledCount++;
      }
    }

    res.json({ success: true, message: `Booking created with ${scheduledCount} scheduled reminders!` });
  } catch (err) {
    console.error('✗ Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ event_date: 1 }).lean();

    for (let b of bookings) {
      b.total_reminders = await ReminderJob.countDocuments({ booking_id: b._id });
      b.sent_reminders = await ReminderJob.countDocuments({ booking_id: b._id, status: 'sent' });
    }

    res.json(bookings);
  } catch (err) {
    console.error('✗ Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const reminders = await ReminderJob.find({ booking_id: booking._id }).sort({ days_before: -1 });
    res.json({ ...booking, reminders });
  } catch (err) {
    console.error('✗ Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await ReminderJob.deleteMany({ booking_id: req.params.id });
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('✗ Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const { language, days_before } = req.query;

    if (!language || !days_before) {
      return res.status(400).json({ error: 'Language and days_before are required query parameters.' });
    }

    const templates = await Template.find({ language, days_before: Number(days_before) }).select('content -_id');
    res.json(templates);
  } catch (err) {
    console.error('✗ Error fetching templates:', err);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};