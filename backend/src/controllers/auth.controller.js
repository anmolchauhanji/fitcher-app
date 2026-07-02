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