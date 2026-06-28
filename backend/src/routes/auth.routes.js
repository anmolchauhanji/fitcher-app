import { Router } from "express";
import { Login, signup,verifyEmail } from "../controllers/auth.controller.js";

const router = Router()

router.post("/signup",signup)
router.post("/verify-email", verifyEmail);
router.post("/Login", Login);

export default router