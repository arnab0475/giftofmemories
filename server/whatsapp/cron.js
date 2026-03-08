import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import ReminderJob from "../Model/ReminderJob.js"; // MUST have .js extension
import { sendWhatsAppMessage } from "./whatsapp.js"; // MUST have .js extension

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const jobs = await ReminderJob.find({ status: 'pending', send_time: currentTime })
                                  .populate('booking_id');

    if (jobs.length === 0) return;

    for (const job of jobs) {
      if (!job.booking_id) continue;

      const eventDate = new Date(job.booking_id.event_date);
      const targetDate = new Date(eventDate);
      targetDate.setDate(targetDate.getDate() - job.days_before);

      if (targetDate.getTime() === today.getTime()) {
        const { message, image, recipient_name, recipient_phone, days_before } = job;
        
        let finalMessage = (message || "")
          .replace(/{name}/g, recipient_name)
          .replace(/{date}/g, eventDate.toISOString().split("T")[0])
          .replace(/{days}/g, days_before);

        const imagePath = image ? path.join(__dirname, "../../uploads", image) : null;
        const phones = recipient_phone.split(',').map(p => p.trim());
        let anySuccess = false;

        for (const p of phones) {
          const success = await sendWhatsAppMessage(p, finalMessage, imagePath);
          if (success) anySuccess = true;
        }

        job.status = anySuccess ? 'sent' : 'failed';
        job.sent_at = new Date();
        await job.save();
        
        console.log(`✓ Processed ${days_before}-day reminder for ${recipient_name}: ${job.status}`);
      }
    }
  } catch (err) {
    console.error("✗ Error in reminder cron job:", err);
  }
});

console.log("✓ WhatsApp Cron jobs initialized (MongoDB Connected)");