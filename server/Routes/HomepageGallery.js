import express from "express";
import multer from "multer";
import {
  getGalleryBySection,
  getAllGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  bulkUploadImages,
} from "../Controller/HomepageGalleryController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get("/section/:section", getGalleryBySection);

// Admin routes
router.get("/admin/get-all", AdminMiddleware, getAllGalleryImages);
router.post(
  "/admin/add",
  AdminMiddleware,
  upload.single("image"),
  addGalleryImage,
);
router.put(
  "/admin/update/:id",
  AdminMiddleware,
  upload.single("image"),
  updateGalleryImage,
);
router.delete("/admin/delete/:id", AdminMiddleware, deleteGalleryImage);
router.post(
  "/admin/bulk-upload",
  AdminMiddleware,
  upload.array("images", 20),
  bulkUploadImages,
);

export default router;
