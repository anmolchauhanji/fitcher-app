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

  return successResponse(
    res,
    200,
    "Login successful.",
    result
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await refreshTokenService(req);

  return successResponse(
    res,
    200,
    "Token refreshed successfully.",
    result
  );
});


export const logout = asyncHandler(async (req, res) => {
  const result = await logoutService(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return successResponse(
    res,
    200,
    result.message
  );
});