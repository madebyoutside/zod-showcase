"use client";

import { PlainContactForm } from "@/app/plain/plain-contact-form";
import { ContactBook } from "@/features/contacts/components/contact-book";
import type { ContactResponse } from "@/features/contacts/schemas/contact.schema";

export function PlainContactBook({ initialContacts }: { initialContacts: ContactResponse[] }) {
  return <ContactBook initialContacts={initialContacts} Form={PlainContactForm} />;
}
