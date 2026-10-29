import { routes } from "@/features/common/const/routes";
import { makeEndpoint } from "@/features/common/utils/endpoint";
import {
  contactInputSchema,
  contactParamsSchema,
  contactResponseSchema,
  listContactsQuerySchema,
} from "@/features/contacts/schemas/contact.schema";

export const listContactsEndpoint = makeEndpoint({
  method: "GET",
  url: () => routes.apiContacts,
  requestSchema: listContactsQuerySchema,
  responseSchema: contactResponseSchema.array(),
});

export const createContactEndpoint = makeEndpoint({
  method: "POST",
  url: () => routes.apiContacts,
  requestSchema: contactInputSchema,
  responseSchema: contactResponseSchema,
});

export const updateContactEndpoint = makeEndpoint({
  method: "PUT",
  url: ({ id }) => routes.apiContact(id),
  paramsSchema: contactParamsSchema,
  requestSchema: contactInputSchema,
  responseSchema: contactResponseSchema,
});
