import type { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Endpoint<
  Request extends z.ZodType = z.ZodType,
  Response extends z.ZodType = z.ZodType,
  Params extends z.ZodType = z.ZodType<void>,
> {
  method: HttpMethod;
  url: (params: z.output<Params>) => string;
  paramsSchema?: Params;
  requestSchema: Request;
  responseSchema: Response;
}

export function makeEndpoint<
  Request extends z.ZodType,
  Response extends z.ZodType,
  Params extends z.ZodType = z.ZodType<void>,
>(endpoint: Endpoint<Request, Response, Params>) {
  return endpoint;
}
