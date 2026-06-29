import env from "../config/env.js";
import { transporter } from "../config/mail.js";
import { verifyEmailTemplate } from "../templates/VerifyEmail.js";

export const sendVerificationEmail = async ({
  name,
  email,
  otp,
}) => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new Error("Email service is not configured");
  }

  const html = verifyEmailTemplate(name, otp);

  await transporter.sendMail({
    from: `"BuildMatch" <${env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your BuildMatch account",
    html,
  });
};