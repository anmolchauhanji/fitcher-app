import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
  "new_project",
  "new_bid",
  "bid_accepted",
  "bid_rejected",
  "project_completed",
  "review_received",
  "contractor_verified",
];

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },

    referenceId: mongoose.Schema.Types.ObjectId,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "notifications",
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);