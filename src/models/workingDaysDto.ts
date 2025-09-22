import z from "zod";

export const QueryWorkingDaysSchema = z
  .object({
    days: z.coerce
      .number()
      .positive()
      .optional()
      .describe("Number of business days to add (optional, positive integer)"),
    hours: z.coerce
      .number()
      .positive()
      .optional()
      .describe("Number of business hours to add (optional, positive integer)"),
    date: z
      .string()
      .datetime({ message: "Date must be in ISO 8601 format with Z suffix" })
      .refine((val) => val.endsWith("Z"), {
        message: "Date must end with 'Z' to indicate UTC timezone",
      })
      .optional()
      .describe(
        "Initial date/time in UTC (ISO 8601) with Z suffix (optional). If provided, it will be the starting point and converted to Colombia local time for business rules; if not provided, calculation starts from current time in Colombia"
      ),
  })
  .refine((data) => data.days !== undefined || data.hours !== undefined, {
    message: "Debe enviarse al menos 'days' o 'hours'.",
    path: ["days"],
  });

export type QueryWorkingDaysSchema = z.infer<typeof QueryWorkingDaysSchema>;
