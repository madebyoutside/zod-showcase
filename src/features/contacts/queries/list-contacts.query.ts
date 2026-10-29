import "server-only";
import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import type { ListContactsQuery } from "@/features/contacts/schemas/contact.schema";

export function listContacts(query: ListContactsQuery) {
  return db
    .select()
    .from(contacts)
    .where(
      and(
        query.role ? eq(contacts.role, query.role) : undefined,
        query.search ? ilike(contacts.name, `%${query.search}%`) : undefined,
      ),
    )
    .orderBy(desc(contacts.createdAt))
    .limit(query.limit);
}
