import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "NEW_PROJECT",
        "PROJECT_CREATED",
        "NEW_BID",
        "BID_ACCEPTED",
        "BID_REJECTED",
        "PROJECT_COMPLETED",
        "PROFILE_VERIFIED",
        "REVIEW_RECEIVED",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({
  receiverId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.virtual("status").get(function () {
  return this.isRead ? "read" : "unread";
});

notificationSchema.set("toJSON", {
  virtuals: true,
});
notificationSchema.set("toObject", {
  virtuals: true,
});

export default mongoose.model(
  "Notification",
  notificationSchema
);