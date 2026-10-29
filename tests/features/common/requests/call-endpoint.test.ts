import { afterEach, expect, mock, test } from "bun:test";
import { z } from "zod";

import { HttpError } from "@/features/common/errors/http-error";
import { callEndpoint } from "@/features/common/requests/call-endpoint";
import { makeEndpoint } from "@/features/common/utils/endpoint";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(response: Response) {
  const fetchMock = mock(async (_url: string, _init?: RequestInit) => response);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

const getItem = makeEndpoint({
  method: "GET",
  url: ({ id }) => `/api/items/${id}`,
  paramsSchema: z.object({ id: z.string() }),
  requestSchema: z.object({ limit: z.coerce.number().default(10), tag: z.string().optional() }),
  responseSchema: z.object({ createdAt: z.coerce.date() }),
});

test("GET sends the parsed request as a query string and parses the response", async () => {
  const fetchMock = stubFetch(Response.json({ createdAt: "2026-10-29T10:00:00.000Z" }));
  const item = await callEndpoint({ endpoint: getItem, params: { id: "7" }, body: {} });
  expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/items/7?limit=10");
  expect(item.createdAt).toBeInstanceOf(Date);
});

test("a non-2xx response throws HttpError with the parsed error body", async () => {
  stubFetch(Response.json({ message: "Taken", fieldErrors: { tag: ["dup"] } }, { status: 409 }));
  const error = await callEndpoint({ endpoint: getItem, params: { id: "7" }, body: {} }).catch((e) => e);
  expect(error).toBeInstanceOf(HttpError);
  expect(error.body.fieldErrors).toEqual({ tag: ["dup"] });
});

test("a response that breaks the contract is rejected", async () => {
  stubFetch(Response.json({ createdAt: "not a date" }));
  expect(callEndpoint({ endpoint: getItem, params: { id: "7" }, body: {} })).rejects.toThrow();
});
