import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { signupSchema } from "../validation/auth.validation.js";
import authenticate from "../middlewares/auth.middleware.js";
import { login, signup, verifyEmail, resendOtp, refreshToken, logout, updateProfile } from "../controllers/auth.controller.js";

const router = Router()

router.post("/signup", validate(signupSchema), signup)
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.patch("/update-profile", authenticate, updateProfile);

export default router