import mongoose from "mongoose";
import {env} from "../config/env.js";

export const connectDB = async () => {
  try {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    await mongoose.connect(env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};