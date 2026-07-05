import ApiError from "../lib/ApiError.js";
import { 
  createUser, 
  findUserByEmail,
  findUserByEmailWithOTP,
  findUserByEmailWithPassword,
  findUserById,
  updateUserById 
} from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import { generateOTP, hashOTP, compareOTP } from "../lib/otp.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import { sendVerificationEmail } from "./email.service.js";

export const signupService = async (userData) => {
  const { name, email, password, role } = userData;
  const normalizedEmail = email?.trim()?.toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const otp = generateOTP();
  console.log(otp);
  const hashedOTP = await hashOTP(otp);

  // Create user document with selected role. Defaults to 'customer' if not provided.
  const user = await createUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: role || 'customer',
    emailVerificationOTP: hashedOTP,
    emailVerificationOTPExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });
  console.log("hased"+user.emailVerificationOTP);
  await sendVerificationEmail({
    name,
    email: normalizedEmail,
    otp
  })

  return {
    message:
      "Account created successfully. Please verify your email.",
  };
};

export const verifyEmailService = async ({email, otp}) => {
  const normalizedEmail = email?.trim()?.toLowerCase();
  const normalizedOtp = String(otp ?? "").trim();

  const user = await findUserByEmailWithOTP(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!normalizedOtp) {
    throw new ApiError(400, "OTP is required");
  }

  if (!user.emailVerificationOTP || !user.emailVerificationOTPExpiry) {
    throw new ApiError(400, "No OTP found. Please request a new one.");
  }

  const isMatch = await compareOTP(normalizedOtp, user.emailVerificationOTP);

  if (!isMatch) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.emailVerificationOTPExpiry < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpiry = undefined;

  await user.save();

  return {
    message: "Email verified successfully",
  };
};

export const resendOtpService = async ({email}) => {
  const normalizedEmail = email?.trim()?.toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  user.emailVerificationOTP = hashedOTP;
  user.emailVerificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    otp
  });

  return {
    message: "OTP sent successfully",
  };
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email first"
    );
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  await updateUserById(user._id, {
    refreshToken,
    lastLoginAt: new Date(),
  });

  user.password = undefined;
  user.refreshToken = undefined;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (req) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUserById(payload.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    return {
      accessToken,
    };
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
};

export const logoutService = async (userId) => {
  await updateUserById(userId, {
    refreshToken: null,
  });

  return {
    message: "Logout successful",
  };
};