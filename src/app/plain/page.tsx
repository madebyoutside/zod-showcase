import type { Metadata } from "next";
import Link from "next/link";

import { PlainContactBook } from "@/app/plain/plain-contact-book";
import { routes } from "@/features/common/const/routes";
import { listContacts } from "@/features/contacts/queries/list-contacts.query";
import { listContactsQuerySchema } from "@/features/contacts/schemas/contact.schema";

export const metadata: Metadata = { title: "Contacts · plain useForm" };

export default async function PlainPage({ searchParams }: PageProps<"/plain">) {
  const query = listContactsQuerySchema.catch({ limit: 20 }).parse(await searchParams);
  const contacts = await listContacts(query);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
      <header className="flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold">Contacts · plain useForm</h1>
        <Link href={routes.home} className="text-sm text-neutral-500 underline">
          useReactHookForm version →
        </Link>
      </header>
      <PlainContactBook initialContacts={contacts} />
    </main>
  );
}
