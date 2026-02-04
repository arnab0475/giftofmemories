import express from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
  toggleSectionVisibility,
} from "../Controller/HomepageSettingsController.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public route - get settings
router.get("/get-settings", getHomepageSettings);

// Admin routes - protected
router.put("/update-settings", verifyToken, updateHomepageSettings);
router.patch("/toggle/:section", verifyToken, toggleSectionVisibility);

export default router;
