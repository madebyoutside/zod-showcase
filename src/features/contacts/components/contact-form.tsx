"use client";

import type { z } from "zod";

import { useReactHookForm } from "@/features/common/hooks/use-react-hook-form";
import type { Endpoint } from "@/features/common/utils/endpoint";
import { ContactFields } from "@/features/contacts/components/contact-fields";
import { createContactEndpoint, updateContactEndpoint } from "@/features/contacts/schemas/contact.endpoints";
import type {
  contactInputSchema,
  ContactResponse,
  contactResponseSchema,
} from "@/features/contacts/schemas/contact.schema";

export interface ContactFormProps {
  contact?: ContactResponse;
  onSaved: (contact: ContactResponse) => void;
}

function EndpointContactForm<Params extends z.ZodType>({
  endpoint,
  params,
  contact,
  onSaved,
}: ContactFormProps & {
  endpoint: Endpoint<typeof contactInputSchema, typeof contactResponseSchema, Params>;
  params?: z.output<Params>;
}) {
  const {
    register,
    formId,
    onSubmit,
    formState: { errors, isSubmitting },
  } = useReactHookForm({
    endpoint,
    params,
    defaultValues: contact,
    toast: {
      disable: false,
      loading: "Saving contact…",
      success: (saved) => `${saved.name} ${contact ? "updated" : "added"}`,
      error: (error) => `Could not save contact: ${error.message}`,
    },
    resetOnSuccess: true,
    onSuccess: onSaved,
  });

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <ContactFields
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        submitLabel={contact ? "Save" : "Add contact"}
      />
    </form>
  );
}

export function ContactForm({ contact, onSaved }: ContactFormProps) {
  if (!contact) return <EndpointContactForm endpoint={createContactEndpoint} onSaved={onSaved} />;
  return (
    <EndpointContactForm
      endpoint={updateContactEndpoint}
      params={{ id: contact.id }}
      contact={contact}
      onSaved={onSaved}
    />
  );
}
