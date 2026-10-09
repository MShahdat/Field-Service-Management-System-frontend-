import { z } from "zod";

export const MAX_REPORT_DESCRIPTION = 500;
export const MAX_REPORT_MB = 10;

export const REPORT_ACCEPT = ".pdf,.doc,.docx";
export const REPORT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const isValidReportFile = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const validExt = ext === "pdf" || ext === "doc" || ext === "docx";
  return validExt && REPORT_MIME_TYPES.includes(file.type);
};

export const reportFileSchema = (required: boolean) =>
  z
    .instanceof(File, { message: "Report file is required" })
    .nullable()
    .refine(
      (file) => {
        if (!file) return !required;
        return true;
      },
      { message: "Report file is required" },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return isValidReportFile(file);
      },
      { message: "Only .pdf, .doc, .docx files are allowed" },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= MAX_REPORT_MB * 1024 * 1024;
      },
      { message: `File must be under ${MAX_REPORT_MB}MB` },
    );

export const reportZodSchema = z.object({
  description: z
    .string()
    .trim()
    .max(
      MAX_REPORT_DESCRIPTION,
      `Description must be ${MAX_REPORT_DESCRIPTION} characters or less`,
    ),
  file: reportFileSchema(true),
});

export const updateReportZodSchema = z.object({
  description: z
    .string()
    .trim()
    .max(
      MAX_REPORT_DESCRIPTION,
      `Description must be ${MAX_REPORT_DESCRIPTION} characters or less`,
    ),
  file: reportFileSchema(false),
});
