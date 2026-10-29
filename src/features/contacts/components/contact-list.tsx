import type { ContactResponse } from "@/features/contacts/schemas/contact.schema";

export function ContactList({
  contacts,
  onEdit,
}: {
  contacts: ContactResponse[];
  onEdit: (contact: ContactResponse) => void;
}) {
  if (contacts.length === 0) return <p className="text-sm text-neutral-500">No contacts yet.</p>;

  return (
    <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
      {contacts.map((contact) => (
        <li key={contact.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <span>
            {contact.name} <span className="text-neutral-500">{contact.email}</span>
          </span>
          <span className="flex items-center gap-3">
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{contact.role}</span>
            <button type="button" onClick={() => onEdit(contact)} className="text-neutral-500 underline">
              Edit
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
