import { Reminder } from "../Model/Reminder.js";

export const createReminder = async (req, res) => {
  try {
    const { customerName, eventType, eventDate, number, message } = req.body;

    if (!customerName || !eventType || !eventDate || !number) {
      return res.status(400).json({
        message:
          "Customer name, event type, event date, and number are required",
      });
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(number.replace(/[\s\-\(\)]/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const newReminder = new Reminder({
      customerName,
      eventType,
      eventDate,
      number,
      message: message || `Reminder for ${eventType} on ${eventDate}`,
      status: "Pending",
    });

    await newReminder.save();
    res.status(201).json({
      message: "Reminder created successfully",
      reminder: newReminder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getPendingReminders = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Get pending reminders - To be implemented" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateReminderStatus = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Update reminder status - To be implemented" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
