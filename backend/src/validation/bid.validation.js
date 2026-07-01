import { z } from "zod";
import mongoose from "mongoose";
import { BID_STATUS } from "../constants/bid-status.constant.js";

const objectIdSchema = z
  .string()
  .refine(
    (value) => mongoose.Types.ObjectId.isValid(value),
    "Invalid ObjectId"
  );

export const createBidSchema = z.object({
  projectId: objectIdSchema,

  totalCost: z.coerce
    .number()
    .positive("Total cost must be greater than 0"),

  completionDays: z.coerce
    .number()
    .int("Completion days must be an integer")
    .positive("Completion days must be greater than 0"),

  materialDetails: z
    .string()
    .trim()
    .min(10, "Material details must be at least 10 characters")
    .max(1000, "Material details cannot exceed 1000 characters"),

  warrantyTerms: z
    .string()
    .trim()
    .min(5, "Warranty terms must be at least 5 characters")
    .max(1000, "Warranty terms cannot exceed 1000 characters"),

  coverNote: z
    .string()
    .trim()
    .min(20, "Cover note must be at least 20 characters")
    .max(2000, "Cover note cannot exceed 2000 characters"),
});

export const updateBidSchema = z.object({
  totalCost: z.coerce.number().positive().optional(),

  completionDays: z.coerce.number().int().positive().optional(),

  materialDetails: z
    .string()
    .trim()
    .min(10)
    .max(1000)
    .optional(),

  warrantyTerms: z
    .string()
    .trim()
    .min(5)
    .max(1000)
    .optional(),

  coverNote: z
    .string()
    .trim()
    .min(20)
    .max(2000)
    .optional(),
});

export const updateBidStatusSchema = z.object({
  status: z.enum(BID_STATUS),
});