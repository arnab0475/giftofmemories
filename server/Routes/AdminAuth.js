import express from 'express'
import { AdminLogin, AdminLogout, AdminRegsiter } from "../Controller/AdminAuthController.js";
const router=express.Router()
router.post("/login",AdminLogin);
router.post("/logout",AdminLogout);
router.post("/register",AdminRegsiter);
export default router;