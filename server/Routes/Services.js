import express from "express";
import multer from "multer";
import {
  addService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../Controller/ServicesController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedImageTypes.test(file.originalname.toLowerCase());
  const mimetype = file.mimetype.startsWith("image/");

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: fileFilter,
});

router.get("/services", getServices);
router.post(
  "/add-service",
  AdminMiddleware,
  upload.array("images", 5),
  addService
);
router.get("/service/:id", getServiceById);
router.put(
  "/update-service/:id",
  AdminMiddleware,
  upload.array("images", 5),
  updateService
); 
router.delete("/delete-service/:id", AdminMiddleware, deleteService);

export default router;
