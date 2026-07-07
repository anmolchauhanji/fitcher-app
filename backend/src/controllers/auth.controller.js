import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  signupService,
  verifyEmailService,
  resendOtpService,
  loginService,
  refreshTokenService,
  logoutService,
} from "../service/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const signup = asyncHandler(async (req, res) => {
  const result = await signupService(req.body);

  return successResponse(
    res,
    201,
    "Account created successfully. Please verify your email.",
    result
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await verifyEmailService(req.body);

  return successResponse(
    res,
    200,
    "Email verified successfully.",
    result
  );
});

export const resendOtp = asyncHandler(async (req, res) => {
  const result = await resendOtpService(req.body);

  return successResponse(
    res,
    200,
    "OTP sent successfully.",
    result
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);

  res
    .cookie("accessToken", result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

  return successResponse(
    res,
    200,
    "Login successful.",
    {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await refreshTokenService(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  return successResponse(
    res,
    200,
    "Token refreshed successfully.",
    {
      accessToken: result.accessToken,
    }
  );
});

export const logout = asyncHandler(async (req, res) => {
  const result = await logoutService(req.user._id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return successResponse(
    res,
    200,
    result.message
  );
});

import { findUserByEmail } from "../repositories/user.repository.js";
import { generateOTP, hashOTP, compareOTP } from "../lib/otp.js";
import { sendVerificationEmail } from "../service/email.service.js";
import ApiError from "../lib/ApiError.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, otp } = req.body;
  const user = req.user;

  // 1. If only name is being updated or email is not provided/changed
  if (!email || email.trim().toLowerCase() === user.email.toLowerCase()) {
    if (name) {
      user.name = name.trim();
      await user.save();
    }
    return successResponse(res, 200, "Profile updated successfully", { user });
  }

  // 2. If email is being changed
  const normalizedEmail = email.trim().toLowerCase();

  // Validate that email is not already taken by another user
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    throw new ApiError(409, "Email is already in use by another account");
  }

  // If OTP is provided, verify it
  if (otp) {
    if (user.pendingEmail !== normalizedEmail) {
      throw new ApiError(400, "Invalid email change request. Please request a new OTP.");
    }
    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpiry) {
      throw new ApiError(400, "No OTP found. Please request a new one.");
    }

    const isMatch = await compareOTP(String(otp).trim(), user.emailVerificationOTP);
    if (!isMatch) {
      throw new ApiError(400, "Invalid OTP");
    }
    if (user.emailVerificationOTPExpiry < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    // OTP verified, update email and name if provided
    user.email = normalizedEmail;
    user.pendingEmail = null;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;
    if (name) {
      user.name = name.trim();
    }
    await user.save();

    return successResponse(res, 200, "Email updated successfully", { user });
  } else {
    // Generate and send OTP for email change
    const verificationOtp = generateOTP();
    console.log(`Email change OTP for ${normalizedEmail}: ${verificationOtp}`);
    const hashedOTP = await hashOTP(verificationOtp);

    user.pendingEmail = normalizedEmail;
    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await sendVerificationEmail({
      name: name || user.name,
      email: normalizedEmail,
      otp: verificationOtp,
    });

    return successResponse(res, 200, "OTP sent to your new email. Please verify.", {
      otpRequired: true,
      pendingEmail: normalizedEmail
    });
  }
});