import { z } from "zod";

export const createWorkOrderSchema =
  z.object({
    projectId: z.string(),

    bidId: z.string(),
  });