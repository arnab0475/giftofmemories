import express from "express";
import {
  postEnquiry,
  getEnquiries,
  exportEnquiries,
} from "../Controller/EnquiryController.js";
import { AdminMiddleware } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();
router.post("/enquiry", postEnquiry);
router.get("/enquiries", AdminMiddleware, getEnquiries);
router.get("/enquiries/export", AdminMiddleware, exportEnquiries);
export default router;