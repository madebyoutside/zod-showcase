import { z } from "zod";

export const apiErrorSchema = z.object({
  message: z.string(),
  fieldErrors: z.partialRecord(z.string(), z.array(z.string())).optional(),
});
export type ApiError = z.output<typeof apiErrorSchema>;

export function toApiError(error: z.ZodError): ApiError {
  return { message: "Invalid request", fieldErrors: z.flattenError(error).fieldErrors };
}
