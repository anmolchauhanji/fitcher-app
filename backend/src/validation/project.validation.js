import { z } from "zod";
import { CATEGORIES } from "../constants/category.constant.js";
import { PROJECT_STATUS } from "../constants/project-status.constant.js";
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  category: z.enum([...CATEGORIES]),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  budget: z
    .object({
      min: z.number().min(0, "Minimum budget cannot be negative"),

      max: z.number().min(0, "Maximum budget cannot be negative"),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum budget must be greater than or equal to minimum budget",
      path: ["max"],
    }),

  location: z.object({
    address: z.string().min(5).max(300),

    city: z.string().min(2),

    state: z.string().min(2),

    pinCode: z.string().regex(/^\d{6}$/),

    coordinates: z.object({
      type: z.literal("Point"),

      coordinates: z.array(z.number()).length(2),
    }),
  }),

  expiresAt: z
    .string()
    .or(z.date())
    .refine(
      (value) => new Date(value) > new Date(),
      "Expiry date must be in the future",
    ),

  photos: z
    .array(
      z.object({
        url: z.url("Invalid image URL"),

        publicId: z.string().min(1, "Public ID is required"),
      }),
    )
    .optional(),
});

export const updateProjectStatusSchema = z.object({
  status: z.enum([...PROJECT_STATUS]),
});
