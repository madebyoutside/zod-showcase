import { endpointHandler } from "@/features/common/server/endpoint-handler";
import { listContacts } from "@/features/contacts/queries/list-contacts.query";
import { insertContact } from "@/features/contacts/queries/save-contact.query";
import { createContactEndpoint, listContactsEndpoint } from "@/features/contacts/schemas/contact.endpoints";

export const GET = endpointHandler({ endpoint: listContactsEndpoint, handle: ({ input }) => listContacts(input) });

export const POST = endpointHandler({ endpoint: createContactEndpoint, handle: ({ input }) => insertContact(input) });
