import "server-only";
import type { NextRequest } from "next/server";
import type { z } from "zod";

import { HttpError } from "@/features/common/errors/http-error";
import { toApiError } from "@/features/common/schemas/api-error.schema";
import type { Endpoint, HttpMethod } from "@/features/common/utils/endpoint";

async function readInput({ request, method }: { request: NextRequest; method: HttpMethod }) {
  if (method === "GET") return Object.fromEntries(request.nextUrl.searchParams);
  return request.json().catch(() => undefined);
}

export function endpointHandler<Request extends z.ZodType, Response extends z.ZodType, Params extends z.ZodType>({
  endpoint,
  handle,
}: {
  endpoint: Endpoint<Request, Response, Params>;
  handle: (args: { input: z.output<Request>; params: z.output<Params> }) => Promise<z.input<Response>>;
}) {
  return async (request: NextRequest, context: { params: Promise<unknown> }) => {
    const params = endpoint.paramsSchema?.safeParse(await context.params);
    if (params && !params.success) return Response.json({ message: "Not found" }, { status: 404 });

    const input = endpoint.requestSchema.safeParse(await readInput({ request, method: endpoint.method }));
    if (!input.success) {
      return Response.json(toApiError(input.error), { status: endpoint.method === "GET" ? 400 : 422 });
    }

    try {
      const output = await handle({ input: input.data, params: params?.data as z.output<Params> });
      return Response.json(output, { status: endpoint.method === "POST" ? 201 : 200 });
    } catch (error) {
      if (error instanceof HttpError) return Response.json(error.body, { status: error.status });
      throw error;
    }
  };
}
