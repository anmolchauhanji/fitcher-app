import mongoose from "mongoose";
import { BID_STATUS } from "../constants/bid-status.constant.js";

const bidSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },

    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: [true, "Contractor ID is required"],
    },

    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [1, "Total cost must be greater than 0"],
    },

    completionDays: {
      type: Number,
      required: [true, "Completion days are required"],
      min: [1, "Completion days must be at least 1 day"],
    },

    materialDetails: {
        required: true,
      type: String,
      trim: true,
      maxlength: [1000, "Material details cannot exceed 1000 characters"],
    },

    warrantyTerms: {
      type: String,
      trim: true,
      required:true,
      maxlength: [1000, "Warranty terms cannot exceed 1000 characters"],
    },

    coverNote: {
      type: String,
      trim: true,
      min: [20, "Cover note must be at least 20 characters"],
      maxlength: [2000, "Cover note cannot exceed 2000 characters"],
    },

    status: {
      type: String,
      enum: BID_STATUS,
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "bids",
  }
);

// One contractor can submit only one bid per project
bidSchema.index(
  {
    projectId: 1,
    contractorId: 1,
  },
  {
    unique: true,
  }
);

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;