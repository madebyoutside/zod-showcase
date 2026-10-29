import type { z } from "zod";

import { HttpError } from "@/features/common/errors/http-error";
import { apiErrorSchema } from "@/features/common/schemas/api-error.schema";
import type { Endpoint } from "@/features/common/utils/endpoint";

function toSearchParams(query: unknown) {
  const entries = Object.entries(query ?? {}).filter(([, value]) => value != null);
  return new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
}

export async function callEndpoint<Request extends z.ZodType, Response extends z.ZodType, Params extends z.ZodType>({
  endpoint,
  params,
  body,
}: {
  endpoint: Endpoint<Request, Response, Params>;
  params?: z.output<Params>;
  body?: z.input<Request>;
}): Promise<z.output<Response>> {
  const data = endpoint.requestSchema.parse(body);
  const url = endpoint.url(params as z.output<Params>);
  const isGet = endpoint.method === "GET";
  const query = isGet ? toSearchParams(data) : "";

  const response = await fetch(query ? `${url}?${query}` : url, {
    method: endpoint.method,
    headers: isGet ? undefined : { "Content-Type": "application/json" },
    body: isGet ? undefined : JSON.stringify(data),
  });
  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const fallback = { message: response.statusText || "Request failed" };
    throw new HttpError({
      status: response.status,
      body: apiErrorSchema.catch(fallback).parse(json),
    });
  }
  return endpoint.responseSchema.parse(json);
}
