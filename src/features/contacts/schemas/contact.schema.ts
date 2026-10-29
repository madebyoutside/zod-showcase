import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { contactRole, contacts } from "@/db/schema";

export const contactRoleSchema = z.enum(contactRole.enumValues);

export const contactInputSchema = createInsertSchema(contacts, {
  name: (schema) => schema.trim().min(2, "At least 2 characters").max(80),
  email: z.email("Enter a valid email").toLowerCase(),
  age: z.int().min(18, "Must be 18 or older").max(120).nullish(),
}).omit({ id: true, createdAt: true });
export type ContactInput = z.output<typeof contactInputSchema>;

export const contactParamsSchema = z.object({ id: z.uuid() });

export const listContactsQuerySchema = z.object({
  role: contactRoleSchema.optional(),
  search: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListContactsQuery = z.output<typeof listContactsQuerySchema>;

export const contactResponseSchema = createSelectSchema(contacts).extend({
  createdAt: z.coerce.date(),
});
export type ContactResponse = z.output<typeof contactResponseSchema>;
