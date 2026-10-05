import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const serviceZodSchema = z.object({
  description: z.string().min(5),
  servicingDate: z.coerce.date(),
  address: z.object({}).passthrough(),
  categoryId: z.uuid(),
  priority: z.string(),
  regionId: z.uuid(),
  preferredStartTime: z
    .string()
    .regex(timeRegex, "preferredStartTime must be HH:mm format"),
});
