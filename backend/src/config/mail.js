import env from "./env.js";
import nodemailer from "nodemailer";

console.log("📧 Email Configuration:");
console.log("   EMAIL_USER:", env.EMAIL_USER);
console.log("   EMAIL_PASS:", env.EMAIL_PASS ? "✅ Configured" : "❌ Missing");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Mail server connected");
  } catch (error) {
    console.log("❌ Mail server connection failed");
    console.error(error.message);
  }
};