export const routes = {
  home: "/",
  plain: "/plain",
  apiContacts: "/api/contacts",
  apiContact: (id: string) => `/api/contacts/${id}`,
} as const;
