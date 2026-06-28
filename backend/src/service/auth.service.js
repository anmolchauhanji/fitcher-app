import crypto from "crypto";
import ApiError from "../lib/ApiError.js";
import { Comparevalue, Hashvalue } from "../lib/password.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "./email.service.js";
import { generateotp } from "../lib/otp.js";

export const signupService = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "email already exists");
  }

  const hashedPassword = await Hashvalue(password);
  // const verificationToken = crypto.randomBytes(32).toString("hex");
  // const verificationTokenExpiry = Date.now() + 1000 * 60 * 60;
  const otp = generateotp();
  const otpexpiry = Date.now() + 1000 * 60 * 10;
  const hashedotp = await Hashvalue(otp);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    // verificationToken,
    // verificationTokenExpiry,
    emailVerificationOTP: hashedotp,
    emailVerificationOTPExpiry: otpexpiry,
  });

  await sendVerificationEmail(user.name, user.email, otp);

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const LoginService = async ({ email, password }) => {
  const useremail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: useremail }).select(
    "+password",
  );
  console.log(existingUser);

  if (!existingUser) {
    throw new ApiError(401, "user not found");
  }
  const ComparePassword = await Comparevalue(password, existingUser.password);
  if (!ComparePassword) {
    throw new ApiError(401, "Invalid password");
  }
  if (!existingUser.isEmailVerified) {
    throw new ApiError(403, "Verify your email first");
  }
  const accessToken = generateAccessToken({
    id: existingUser.id,
    email: existingUser.email,
  });
  const refreshToken = generateRefreshToken({
    id: existingUser.id,
    email: existingUser.email,
  });
  return {
    user: existingUser,
    accessToken,
    refreshToken,
  };
};
