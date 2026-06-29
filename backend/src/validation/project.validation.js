import { z } from "zod";
import { PROJECT_CATEGORIES } from "../constants/project-category.constant.js";
import { PROJECT_STATUS } from "../constants/project-status.constant.js";
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  category: z.enum(PROJECT_CATEGORIES),

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
    coordinates: z
      .array(z.number())
      .length(2, "Coordinates must contain longitude and latitude"),

    pinCode: z
      .string()
      .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(300, "Address cannot exceed 300 characters"),
  }),

  photos: z
    .array(
      z.object({
        url: z.url("Invalid image URL"),

        publicId: z
          .string()
          .min(1, "Public ID is required"),
      })
    )
    .optional(),
});



export const updateProjectStatusSchema = z.object({
  status: z.enum(PROJECT_STATUS),
});