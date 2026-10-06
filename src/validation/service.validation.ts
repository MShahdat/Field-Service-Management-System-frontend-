import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const serviceZodSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  servicingDate: z.string().min(1, "Please select a date"),
  preferredStartTime: z.string().regex(timeRegex, "Use HH:mm format"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  latitude: z.string(),
  longitude: z.string(),
  categoryId: z.uuid("Select a category"),
  regionId: z.uuid("Select a region"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    message: "Select a priority",
  }),
});
