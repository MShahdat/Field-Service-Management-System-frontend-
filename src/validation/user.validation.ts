import z from "zod";

export const statusUpdateZodSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED", "DELETED"], {
    error: (issue) =>
      issue.input === undefined ? "Status is required" : undefined,
  }),
});
