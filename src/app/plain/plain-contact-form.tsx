"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { routes } from "@/features/common/const/routes";
import { apiErrorSchema } from "@/features/common/schemas/api-error.schema";
import { ContactFields } from "@/features/contacts/components/contact-fields";
import type { ContactFormProps } from "@/features/contacts/components/contact-form";
import { contactInputSchema, contactResponseSchema } from "@/features/contacts/schemas/contact.schema";

export function PlainContactForm({ contact, onSaved }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactInputSchema),
    defaultValues: contact,
  });

  const method = contact ? "PUT" : "POST";
  const url = contact ? routes.apiContact(contact.id) : routes.apiContacts;
  const formId = `${method} ${url}`;

  const showError = (message: string) => {
    setError("root.server", { message });
    toast.error(`Could not save contact: ${message}`, { id: formId });
  };

  const onSubmit = handleSubmit(async (values) => {
    toast.loading("Saving contact…", { id: formId });

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null);
    if (!response) return showError("Something went wrong, try again.");

    const json: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = apiErrorSchema.catch({ message: response.statusText || "Request failed" }).parse(json);
      for (const [field, messages] of Object.entries(error.fieldErrors ?? {})) {
        const key = contactInputSchema.keyof().safeParse(field);
        if (key.success) setError(key.data, { message: messages?.[0] });
      }
      return showError(error.message);
    }

    const saved = contactResponseSchema.safeParse(json);
    if (!saved.success) return showError("Something went wrong, try again.");

    toast.success(`${saved.data.name} ${contact ? "updated" : "added"}`, { id: formId });
    reset();
    onSaved(saved.data);
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
