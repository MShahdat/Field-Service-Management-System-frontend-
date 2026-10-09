import { z } from "zod";

export const MAX_ATTACHMENT_DESCRIPTION = 500;
export const MAX_ATTACHMENT_MB = 10;
export const MAX_ATTACHMENT_COUNT = 10;

export const ATTACHMENT_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx";
export const ATTACHMENT_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const attachmentTypeEnum = z.enum(
  ["BEFORE_PHOTO", "AFTER_PHOTO", "SIGNATURE", "DOCUMENT"],
  { message: "Type is required" },
);

export const isValidAttachmentFile = (file: File) =>
  ATTACHMENT_MIME_TYPES.includes(file.type);

export const attachmentFilesSchema = z
  .array(z.instanceof(File, { message: "Attachment file is required" }))
  .min(1, "At least one file is required")
  .max(MAX_ATTACHMENT_COUNT, `At most ${MAX_ATTACHMENT_COUNT} files allowed`)
  .refine((files) => files.every(isValidAttachmentFile), {
    message: "Only images (.png,.jpg,.jpeg,.webp) and .pdf,.doc,.docx allowed",
  })
  .refine(
    (files) => files.every((f) => f.size <= MAX_ATTACHMENT_MB * 1024 * 1024),
    {
      message: `Each file must be under ${MAX_ATTACHMENT_MB}MB`,
    },
  );

export const createAttachmentZodSchema = z.object({
  type: attachmentTypeEnum,
  description: z
    .string()
    .trim()
    .max(
      MAX_ATTACHMENT_DESCRIPTION,
      `Description must be ${MAX_ATTACHMENT_DESCRIPTION} characters or less`,
    ),
  files: attachmentFilesSchema,
});

// Update: metadata only (no image replace) — form keeps both as strings,
// caller maps to IUpdateAttachmentPayload (both optional on the API).
export const updateAttachmentZodSchema = z.object({
  type: attachmentTypeEnum,
  description: z
    .string()
    .trim()
    .max(
      MAX_ATTACHMENT_DESCRIPTION,
      `Description must be ${MAX_ATTACHMENT_DESCRIPTION} characters or less`,
    ),
});
