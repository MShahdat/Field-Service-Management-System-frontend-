import { z } from "zod";

export const MAX_FEEDBACK_COMMENT = 500;

export const feedbackZodSchema = z.object({
  rating: z
    .number({ message: "Rating is required" })
    .min(1, "Please select a rating")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(
      MAX_FEEDBACK_COMMENT,
      `Comment must be ${MAX_FEEDBACK_COMMENT} characters or less`,
    ),
});
