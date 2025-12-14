import express from "express";
import {
  createReminder,
  getPendingReminders,
  updateReminderStatus,
} from "../Controller/ReminderController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();
router.post("/admin/reminders", AdminMiddleware, createReminder);
router.get("/n8n/reminders/pending", getPendingReminders);
router.patch("/n8n/reminders/:id", updateReminderStatus);
export default router;
