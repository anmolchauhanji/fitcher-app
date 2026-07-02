import mongoose from "mongoose";

export const WORK_ORDER_STATUS = [
  "active",
  "completed",
  "cancelled",
];

const workOrderSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },

    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
      index: true,
    },

    agreedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedDays: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: WORK_ORDER_STATUS,
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,

    cancelledAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "workorders",
  }
);

const WorkOrder = mongoose.model(
  "WorkOrder",
  workOrderSchema
);

export default WorkOrder;