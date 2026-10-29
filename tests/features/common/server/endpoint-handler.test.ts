import { expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { z } from "zod";

import { HttpError } from "@/features/common/errors/http-error";
import { endpointHandler } from "@/features/common/server/endpoint-handler";
import { makeEndpoint } from "@/features/common/utils/endpoint";

const createItem = makeEndpoint({
  method: "POST",
  url: () => "/api/items",
  requestSchema: z.object({ name: z.string().trim().min(2) }),
  responseSchema: z.object({ name: z.string() }),
});

const handler = endpointHandler({
  endpoint: createItem,
  handle: async ({ input: { name } }) => {
    if (name === "taken") throw new HttpError({ status: 409, body: { message: "Taken" } });
    return { name };
  },
});

const post = (body: string) =>
  handler(new NextRequest("http://test/api/items", { method: "POST", body }), { params: Promise.resolve({}) });

test("valid input reaches the handler with parsed data", async () => {
  const response = await post('{"name":"  Ada "}');
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ name: "Ada" });
});

test("invalid or malformed input returns 422 with field errors", async () => {
  expect(await (await post('{"name":"A"}')).json()).toHaveProperty("fieldErrors.name");
  expect((await post("not json")).status).toBe(422);
});

test("HttpError thrown by the handler becomes its status and body", async () => {
  const response = await post('{"name":"taken"}');
  expect(response.status).toBe(409);
  expect(await response.json()).toEqual({ message: "Taken" });
});

const updateItem = makeEndpoint({
  method: "PUT",
  url: ({ id }) => `/api/items/${id}`,
  paramsSchema: z.object({ id: z.uuid() }),
  requestSchema: z.object({ name: z.string() }),
  responseSchema: z.object({ id: z.string(), name: z.string() }),
});

const updateHandler = endpointHandler({
  endpoint: updateItem,
  handle: async ({ input, params }) => ({ id: params.id, ...input }),
});

const put = (id: string) =>
  updateHandler(new NextRequest(`http://test/api/items/${id}`, { method: "PUT", body: '{"name":"Ada"}' }), {
    params: Promise.resolve({ id }),
  });

test("route params are validated and passed to the handler", async () => {
  const id = "11111111-1111-4111-8111-111111111111";
  expect(await (await put(id)).json()).toEqual({ id, name: "Ada" });
  expect((await put("not-a-uuid")).status).toBe(404);
});
