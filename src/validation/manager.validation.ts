import { z } from "zod";

const PHONE_REGEX = /^(?:\+8801|01)[3-9]\d{8}$/;
const NID_REGEX = /^(?:\d{10}|\d{13}|\d{17})$/;

export const managerApplyZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid Bangladeshi phone number format"),
  nid: z
    .string()
    .min(1, "NID number is required")
    .regex(NID_REGEX, "NID must be exactly 10, 13, or 17 digits"),
  region: z.string("Please select a region").uuid("Invalid region selection"),
  street: z.string().min(1, "Street address is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d+$/, "Postal code must contain only numbers")
    .max(10, "Postal code is too long"),
});
