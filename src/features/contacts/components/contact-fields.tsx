import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { z } from "zod";

import { type contactInputSchema, contactRoleSchema } from "@/features/contacts/schemas/contact.schema";

export type ContactFormValues = z.input<typeof contactInputSchema>;

const inputClass = "rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

export function ContactFields({
  register,
  errors,
  isSubmitting,
  submitLabel,
}: {
  register: UseFormRegister<ContactFormValues>;
  errors: FieldErrors<ContactFormValues>;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <>
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input {...register("name")} className={inputClass} />
        <FieldError message={errors.name?.message} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input {...register("email")} type="email" className={inputClass} />
        <FieldError message={errors.email?.message} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Role
        <select {...register("role")} className={inputClass}>
          {contactRoleSchema.options.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <FieldError message={errors.role?.message} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Age (optional)
        <input
          {...register("age", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
          type="number"
          className={inputClass}
        />
        <FieldError message={errors.age?.message} />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
      <FieldError message={errors.root?.server?.message} />
    </>
  );
}
