import mongoose from "mongoose";
// import { PROJECT_STATUS } from "../constants/project-status.constant.js";
import { CATEGORIES } from "../constants/category.constant.js";
import { PROJECT_STATUS } from "../constants/project-status.constant.js";

const documentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      required: true,
    },
    publicId: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false },
);
const projectSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },

    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Project category is required"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    budget: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: function (value) {
            return value > this.budget.min;
          },
          message: "Maximum budget must be greater than to minimum budget",
        },
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },

      pinCode: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "Pin code must be 6 digits"],
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    photos: [documentSchema],

    status: {
      type: String,
      enum: PROJECT_STATUS,
      default: "open",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    selectedBidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Geo Index

projectSchema.index({ location: "2dsphere" });
projectSchema.index({ "location.pinCode": 1 });
// Compound Index
projectSchema.index({ status: 1, expiresAt: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
