import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRouter from "./Routes/AdminAuth.js";
import ServicesRouter from "./Routes/Services.js";
import GalleryRouter from "./Routes/Gallery.js";
import EnquiryRouter from "./Routes/Enquiry.js";
import ReminderRouter from "./Routes/Reminder.js";
import TestimonialRouter from "./Routes/Testimonial.js";
import PopupRouter from "./Routes/Popup.js";
import HeroRouter from "./Routes/Hero.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
await connectDB();
app.use("/api/admin", adminRouter);
app.use("/api/services", ServicesRouter);
app.use("/api/gallery", GalleryRouter);
app.use("/api/enquiry", EnquiryRouter);
app.use("/api/reminder", ReminderRouter);
app.use("/api/testimonial", TestimonialRouter);
app.use("/api/pop", PopupRouter);
app.use('/api/hero',HeroRouter);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
