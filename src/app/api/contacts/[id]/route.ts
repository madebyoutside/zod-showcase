import { endpointHandler } from "@/features/common/server/endpoint-handler";
import { updateContact } from "@/features/contacts/queries/save-contact.query";
import { updateContactEndpoint } from "@/features/contacts/schemas/contact.endpoints";

export const PUT = endpointHandler({
  endpoint: updateContactEndpoint,
  handle: ({ input, params }) => updateContact({ id: params.id, input }),
});
