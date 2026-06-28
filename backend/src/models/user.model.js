import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      trim: true,
      type: String,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      required: true,
    },
    email: {
      trim: true,
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "password must be at least 6 characters"],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
      select: false,
    },

    emailVerificationOTPExpiry: {
      type: Date,
    },

  
//     goal: {
//     type: String,
//     enum: [
//         "fat_loss",
//         "muscle_gain",
//         "consistency"
//     ],
//     default: "consistency"
// },
//     currentStreak:{
//       type:Number,
//       default:0,
//       min:0
//     },
//    totalXP:{
//     type:Number,
//     default:0,
//     min:0
// },
//     level:{
//       default:1,
//       type:Number,
//       min:1
//     }

    
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
