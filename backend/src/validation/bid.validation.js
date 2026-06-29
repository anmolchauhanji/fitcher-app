import { z } from "zod";
import { BID_STATUS } from "../constants/bid-status.constant.js";

export const createBidSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),

  totalCost: z
    .number()
    .positive("Total cost must be greater than 0"),

  completionDays: z
    .number()
    .int("Completion days must be an integer")
    .positive("Completion days must be greater than 0"),

  materialDetails: z
    .string()
    .min(10, "Material details must be at least 10 characters")
    .max(1000, "Material details cannot exceed 1000 characters"),

  warrantyTerms: z
    .string()
    .min(5, "Warranty terms must be at least 5 characters")
    .max(1000, "Warranty terms cannot exceed 1000 characters"),

  coverNote: z
    .string()
    .min(20, "Cover note must be at least 20 characters")
    .max(2000, "Cover note cannot exceed 2000 characters"),
});

export const updateBidStatusSchema = z.object({
  status: z.enum([...BID_STATUS]),
});