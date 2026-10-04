import { z } from "zod";

export const MAX_DESCRIPTION = 300;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or less"),
  duration: z
    .number({ message: "Duration is required" })
    .min(1, "Duration must be at least 1"),
  icon: z.string().trim(),
  description: z
    .string()
    .max(MAX_DESCRIPTION, `Max ${MAX_DESCRIPTION} characters`),
});
