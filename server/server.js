import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminRouter from "./Routes/AdminAuth.js";
import ServicesRouter from "./Routes/Services.js";
import GalleryRouter from "./Routes/Gallery.js";
import EnquiryRouter from "./Routes/Enquiry.js";
import ReminderRouter from "./Routes/Reminder.js";
import TestimonialRouter from "./Routes/Testimonial.js";
import PopupRouter from "./Routes/Popup.js";
import HeroRouter from "./Routes/Hero.js";
import BlogRouter from "./Routes/Blog.js";
import ShopRouter from "./Routes/ShopRouter.js";
import ProductCategoryRouter from "./Routes/ProductCategoryRouter.js";
import UserRouter from "./Routes/User.js";
import AboutRouter from "./Routes/About.js";
import HomepageSettingsRouter from "./Routes/HomepageSettings.js";
import PageHeroRouter from "./Routes/PageHero.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONT_END_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
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
app.use("/api/hero", HeroRouter);
app.use("/api/blogs", BlogRouter);
app.use("/api/shop", ShopRouter);
app.use("/api/product-categories", ProductCategoryRouter);
app.use("/api/users", UserRouter);
app.use("/api/about", AboutRouter);
app.use("/api/homepage-settings", HomepageSettingsRouter);
app.use("/api/page-hero", PageHeroRouter);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
