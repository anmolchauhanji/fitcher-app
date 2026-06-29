import mongoose from "mongoose";
import { CATEGORIES } from "../constants/category.constant.js";
import { VERIFICATION_STATUS } from "../constants/verification.constant.js";
import { SUBSCRIPTION_TIERS } from "../constants/subscription.constant.js";

 const documentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      required: true
    },
    publicId: {
      type: String,
      trim: true,
      required: true
    },
  },
  { _id: false }
);

const contractorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: [2, "Business name must be at least 2 characters"],
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },

    tradeCategories: [
      {
        type: String,
        enum: CATEGORIES,
      },
    ],

    servicePinCodes: [
      {
        type: String,
      },
    ],

    portfolioImages: [
     documentSchema
    ],

    kycDocuments: {
      aadhar: documentSchema,

      pan: documentSchema,
    },

    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUS,
      default: "pending",
    },

    subscriptionTier: {
      type: String,
      enum: SUBSCRIPTION_TIERS,
      default: "free",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalCompletedProjects: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "contractors",
  },
);

contractorSchema.index({ servicePinCodes: 1 });

const Contractor = mongoose.model("Contractor", contractorSchema);

export default Contractor;
