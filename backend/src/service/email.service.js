import env from "../config/env.js";
import { transporter } from "../config/mail.js";
import ApiError from "../lib/ApiError.js";
import { Comparevalue } from "../lib/password.js";
import { User } from "../models/user.model.js";
import { verifyEmailTemplate } from "../templates/VerifyEmail.js";

export const sendVerificationEmail = async (name, email,otp) => {
  console.log(`📧 Sending verification email to ${email} for user ${name}`);
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials are not configured. Skipping verification email.");
    return;
  }

  // const verifyUrl = `${env.CLIENT_URL}/verify-email/${token}`;

  try {
    const htmlBody = verifyEmailTemplate(name,otp);
    const response = await transporter.sendMail({
      from: `"Fitness App" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Fitness App - Verify your account",
      html: htmlBody,
      attachDataUrls: true,
    });
    
    console.log("✅ Email sent successfully:", response.messageId);
    console.log("📬 Sent to:", email);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
};


export const emailVerification = async ({email,otp})=>{
  const user =await User.findOne({email}).select("+emailVerificationOTP +password +isEmailVerified");
  if (!user) {
    throw new ApiError(400,"user not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400,"email is verified");
  }

  if (!otp) {
    throw new ApiError(400,"OTP is required");
  }

  if (!user.emailVerificationOTP || !user.emailVerificationOTPExpiry) {
    throw new ApiError(400,"OTP is not available for this user");
  }

  if (user.emailVerificationOTPExpiry < Date.now()) {
    throw new ApiError(400,"OTP has expired");
  }

  const isOTPvalid = await Comparevalue(otp, user.emailVerificationOTP);

  if (!isOTPvalid) {
    throw new ApiError(400,"OTP is not valid");
  }
  
  user.isEmailVerified = true;
  user.emailVerificationOTPExpiry = undefined;
  user.emailVerificationOTP  = undefined;
  await user.save()

  return {
    id: user.id,
    name:user.name,
    isEmailVerified: user.isEmailVerified,
    email:user.email
  }
}