import Link from "next/link";

import { routes } from "@/features/common/const/routes";
import { ContactBook } from "@/features/contacts/components/contact-book";
import { listContacts } from "@/features/contacts/queries/list-contacts.query";
import { listContactsQuerySchema } from "@/features/contacts/schemas/contact.schema";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const query = listContactsQuerySchema.catch({ limit: 20 }).parse(await searchParams);
  const contacts = await listContacts(query);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
      <header className="flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold">Contacts · useReactHookForm</h1>
        <Link href={routes.plain} className="text-sm text-neutral-500 underline">
          Plain useForm version →
        </Link>
      </header>
      <ContactBook initialContacts={contacts} />
    </main>
  );
}
