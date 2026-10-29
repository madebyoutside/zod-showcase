import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { isUniqueViolation } from "@/db/errors";
import { contacts } from "@/db/schema";
import { HttpError } from "@/features/common/errors/http-error";
import type { ContactInput } from "@/features/contacts/schemas/contact.schema";

function rethrowEmailTaken(error: unknown): never {
  if (!isUniqueViolation(error)) throw error;
  throw new HttpError({
    status: 409,
    body: { message: "Contact already exists", fieldErrors: { email: ["Email is already in use"] } },
  });
}

export async function insertContact(input: ContactInput) {
  const [contact] = await db.insert(contacts).values(input).returning().catch(rethrowEmailTaken);
  return contact;
}

export async function updateContact({ id, input }: { id: string; input: ContactInput }) {
  const [contact] = await db
    .update(contacts)
    .set(input)
    .where(eq(contacts.id, id))
    .returning()
    .catch(rethrowEmailTaken);
  if (contact) return contact;
  throw new HttpError({ status: 404, body: { message: "Contact not found" } });
}
