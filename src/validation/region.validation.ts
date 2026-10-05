import { z } from "zod";
import { MAX_DESCRIPTION } from "./category.validation";

export const regionSchema = z.object({
  area: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or less"),

  description: z
    .string()
    .max(MAX_DESCRIPTION, `Max ${MAX_DESCRIPTION} characters`),
});
