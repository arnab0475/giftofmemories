import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as BookingController from '../Controller/BookingController.js';
import { getQr, getStatus } from '../whatsapp/whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/bookings', upload.any(), BookingController.createBooking);
router.get('/bookings', BookingController.getAllBookings);
router.get('/bookings/:id', BookingController.getBookingById);
router.delete('/bookings/:id', BookingController.deleteBooking);
router.get('/templates', BookingController.getTemplates);
router.get('/whatsapp-status', (req, res) => {
  res.json({ 
    status: getStatus(), 
    qr: getQr() 
  });
});
export default router;