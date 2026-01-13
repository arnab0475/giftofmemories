import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  getProductsByCategory,
  getBestsellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleBestseller,
  toggleActiveStatus,
} from "../Controller/ShopController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedTypes.test(extname) && mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Public routes
router.get("/get-products", getAllProducts);
router.get("/get-product/:id", getProductById);
router.get("/get-products/category/:category", getProductsByCategory);
router.get("/get-bestsellers", getBestsellerProducts);

// Admin routes (protected)
router.get("/admin/get-products", AdminMiddleware, getAllProductsAdmin);
router.post(
  "/add-product",
  AdminMiddleware,
  upload.single("image"),
  addProduct
);
router.put(
  "/update-product/:id",
  AdminMiddleware,
  upload.single("image"),
  updateProduct
);
router.delete("/delete-product/:id", AdminMiddleware, deleteProduct);
router.patch("/toggle-bestseller/:id", AdminMiddleware, toggleBestseller);
router.patch("/toggle-active/:id", AdminMiddleware, toggleActiveStatus);

export default router;
