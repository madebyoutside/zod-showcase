"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type FieldValues, type Path, useForm } from "react-hook-form";
import { toast as sonner } from "sonner";
import type { z } from "zod";

import { HttpError } from "@/features/common/errors/http-error";
import { callEndpoint } from "@/features/common/requests/call-endpoint";
import type { ApiError } from "@/features/common/schemas/api-error.schema";
import type { Endpoint } from "@/features/common/utils/endpoint";

function toApiError(error: unknown): ApiError {
  if (error instanceof HttpError) return error.body;
  return { message: "Something went wrong, try again." };
}

export function useReactHookForm<
  Input extends FieldValues,
  Output extends FieldValues,
  Response extends z.ZodType,
  Params extends z.ZodType,
>({
  endpoint,
  params,
  formId = `${endpoint.method} ${endpoint.url(params as z.output<Params>)}`,
  defaultValues,
  resetOnSuccess = true,
  toast,
  onSuccess,
}: {
  endpoint: Endpoint<z.ZodType<Output, Input>, Response, Params>;
  params?: z.output<Params>;
  formId?: string;
  defaultValues?: DefaultValues<Input>;
  resetOnSuccess?: boolean;
  toast?: {
    disable?: boolean;
    loading?: string;
    success?: string | ((data: z.output<Response>) => string);
    error?: string | ((error: ApiError) => string);
  };
  onSuccess?: (data: z.output<Response>) => unknown;
}) {
  const form = useForm<Input, unknown, Output>({
    resolver: zodResolver<Input, unknown, Output>(endpoint.requestSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async () => {
    const request = callEndpoint({ endpoint, params, body: form.getValues() });
    if (!toast?.disable) {
      const error = toast?.error;
      sonner.promise(request, {
        id: formId,
        loading: toast?.loading ?? "Saving…",
        success: toast?.success ?? "Saved",
        error: (cause) => {
          const body = toApiError(cause);
          if (typeof error === "function") return error(body);
          return error ?? body.message;
        },
      });
    }

    const result = await request.then(
      (data) => ({ ok: true as const, data }),
      (error: unknown) => ({ ok: false as const, error: toApiError(error) }),
    );

    if (!result.ok) {
      for (const [field, messages] of Object.entries(result.error.fieldErrors ?? {})) {
        form.setError(field as Path<Input>, { message: messages?.[0] });
      }
      form.setError("root.server", { message: result.error.message });
      return;
    }

    if (resetOnSuccess) form.reset();
    await onSuccess?.(result.data);
  });

  return { ...form, formId, onSubmit };
}
