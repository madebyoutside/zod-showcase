import { describe, expect, test } from "bun:test";

import {
  contactResponseSchema,
  contactInputSchema,
  listContactsQuerySchema,
} from "@/features/contacts/schemas/contact.schema";

describe("contactInputSchema", () => {
  test("trims, lowercases and applies the column default as optional", () => {
    expect(contactInputSchema.parse({ name: "  Ada ", email: "ADA@Example.com" })).toEqual({
      name: "Ada",
      email: "ada@example.com",
    });
  });

  test("accepts a null age because the column is nullable", () => {
    expect(contactInputSchema.safeParse({ name: "Ada", email: "a@b.co", age: null }).success).toBe(true);
  });

  test("reports every invalid field by path", () => {
    const result = contactInputSchema.safeParse({
      name: "A",
      email: "nope",
      role: "admin",
      age: 12.5,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining(["name", "email", "role", "age"]),
    );
  });

  test("strips server-owned columns", () => {
    const parsed = contactInputSchema.parse({ name: "Ada", email: "a@b.co", id: "x" });
    expect(parsed).not.toHaveProperty("id");
  });
});

test("listContactsQuerySchema coerces search params and applies defaults", () => {
  expect(listContactsQuerySchema.parse({})).toEqual({ limit: 20 });
  expect(listContactsQuerySchema.parse({ limit: "5", role: "lead" })).toEqual({
    limit: 5,
    role: "lead",
  });
  expect(listContactsQuerySchema.safeParse({ limit: "500" }).success).toBe(false);
});

test("contactResponseSchema revives ISO dates from JSON", () => {
  const contact = contactResponseSchema.parse({
    id: "11111111-1111-4111-8111-111111111111",
    name: "Ada",
    email: "a@b.co",
    role: "lead",
    age: null,
    createdAt: "2026-10-29T10:00:00.000Z",
  });
  expect(contact.createdAt).toBeInstanceOf(Date);
});
