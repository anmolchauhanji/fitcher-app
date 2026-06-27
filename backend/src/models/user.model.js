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
      }
    },
      password: {
        type: [String, "password is required"],
        required:[true,"Password is required"],
        minlength:[6,"password must be at least 6 characters"],
        Select:false
      },
      isemailverified:{
        type:Boolean,
        default:false
        
      },
      goal:{
        type:String,
        enum:["fat loss","muscle gain","consitency"],
        default:"consistency"

      },
      currentStreak:{
        type:Number,
        default:0,
        min:0
      },
      totalXP:{

      },
      level:{
        default:1,
        type:Number,
        min:1
      }


    ,
  },
  { timestamps: true },
);




const User = mongoose.model("User", userSchema);
