"use client";

import { type ComponentType, useState } from "react";

import { Modal } from "@/features/common/components/modal";
import { ContactForm, type ContactFormProps } from "@/features/contacts/components/contact-form";
import { ContactList } from "@/features/contacts/components/contact-list";
import type { ContactResponse } from "@/features/contacts/schemas/contact.schema";

export function ContactBook({
  initialContacts,
  Form = ContactForm,
}: {
  initialContacts: ContactResponse[];
  Form?: ComponentType<ContactFormProps>;
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [modal, setModal] = useState<{ contact?: ContactResponse } | null>(null);

  const onSaved = (saved: ContactResponse) => {
    setContacts((current) =>
      current.some((c) => c.id === saved.id)
        ? current.map((c) => (c.id === saved.id ? saved : c))
        : [saved, ...current],
    );
    setModal(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModal({})}
        className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm text-white"
      >
        Add contact
      </button>
      <ContactList contacts={contacts} onEdit={(contact) => setModal({ contact })} />
      {modal && (
        <Modal title={modal.contact ? "Edit contact" : "New contact"} onClose={() => setModal(null)}>
          <Form contact={modal.contact} onSaved={onSaved} />
        </Modal>
      )}
    </>
  );
}
