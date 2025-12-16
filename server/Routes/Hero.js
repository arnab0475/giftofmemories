import express from "express";
import multer from "multer";
import { addHero, getHero, updateHero } from "../Controller/HeroController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
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
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

router.post("/admin/hero", AdminMiddleware, upload.single("image"), addHero);
router.get("/hero", getHero);
router.put(
  "/admin/hero/:id",
  AdminMiddleware,
  upload.single("image"),
  updateHero
);

export default router;
