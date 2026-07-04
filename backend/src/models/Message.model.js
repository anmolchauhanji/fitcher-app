import mongoose from "mongoose";

export const MESSAGE_TYPES = [
  "text",
  "image",
  "document",
];

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      enum: MESSAGE_TYPES,
      default: "text",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    attachment: {
      url: String,
      publicId: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "messages",
  }
);

messageSchema.index({
  chatId: 1,
  createdAt: -1,
});

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;