import { z } from "zod";
import { CATEGORIES } from "../constants/category.constant.js";

export const completeContractorProfileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name cannot exceed 100 characters"),

  tradeCategories: z
    .array(z.enum([...CATEGORIES]))
    .min(1, "At least one trade category is required"),

  servicePinCodes: z
    .array(
      z.string().regex(/^\d{6}$/, "Pin code must be exactly 6 digits")
    )
    .min(1, "At least one service pin code is required"),

  portfolioImages: z
    .array(
      z.object({
        url: z.url("Invalid image URL"),
        publicId: z.string().min(1, "Public ID is required"),
      })
    )
    .optional(),

  kycDocuments: z.object({
    aadhar: z.object({
      url: z.url("Invalid Aadhaar URL"),
      publicId: z.string().min(1, "Aadhaar Public ID is required"),
    }),

    pan: z.object({
      url: z.url("Invalid PAN URL"),
      publicId: z.string().min(1, "PAN Public ID is required"),
    }),
  }),
});