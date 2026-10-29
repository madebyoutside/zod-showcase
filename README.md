# Zod showcase

Next.js 16 · React 19 · Zod 4 · React Hook Form · Drizzle ORM (Postgres) · Bun for install, format, lint, typecheck and tests. Folder layout follows `nextjs-structure`.

## Run

```sh
bun install
cp .env.example .env.local     # set DATABASE_URL
bun run db:push                # create tables from src/db/schema.ts
bun dev                        # env is validated first; a bad env exits with a readable error
mise run dev                   # same, served at https://zod-showcase.localhost via portless
```

`bun run check` runs `bun fmt --check`, `bun lint`, `next typegen`, `bun check` (typecheck) and `bun test`. `bun run fix` formats and applies lint fixes.

## Where Zod is used

| Use             | File                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| Env validation  | `src/config/{client,server}.env.ts`, run by `scripts/pre-dev.ts` before dev/build |
| ORM schema      | `src/db/schema.ts` (Drizzle table) → `drizzle-zod` in `contact.schema.ts`         |
| Endpoints       | `features/contacts/schemas/contact.endpoints.ts`                                  |
| API request     | `features/common/server/endpoint-handler.ts`                                      |
| API response    | `features/common/requests/call-endpoint.ts`                                       |
| Form validation | `features/common/hooks/use-react-hook-form.ts`                                    |

## Endpoints drive everything

An endpoint is the contract: method, URL, request schema and response schema.

```ts
export const createContactEndpoint = makeEndpoint({
  method: "POST",
  url: () => routes.apiContacts,
  requestSchema: createContactSchema,
  responseSchema: contactResponseSchema,
});
```

Dynamic routes add a `paramsSchema`, which types `url(params)` on the client and validates the route params on the server (invalid → 404):

```ts
export const updateContactEndpoint = makeEndpoint({
  method: "PUT",
  url: ({ id }) => routes.apiContact(id),
  paramsSchema: contactParamsSchema,
  requestSchema: contactInputSchema,
  responseSchema: contactResponseSchema,
});
```

- **Server:** `export const PUT = endpointHandler({ endpoint, handle: ({ input, params }) => updateContact({ id: params.id, input }) })`. The body (or the query string for GET) is parsed before `handle` runs. Invalid input returns 422 (400 for GET) with `fieldErrors`. An `HttpError` thrown inside `handle` becomes its status and body.
- **Client:** `callEndpoint({ endpoint, params, body })` validates the request, sends it, and parses the response with `responseSchema`. `createdAt` comes back as a `Date`. A non-2xx response throws `HttpError`.
- **Forms:** `useReactHookForm({ endpoint, defaultValues, onSuccess })` returns the usual `useForm` API, with `onSubmit` wired to the endpoint. Client validation uses `requestSchema`. Server `fieldErrors`, such as a duplicate email, land on their fields, and the message lands on `errors.root.server`.

The Drizzle table is the single source of truth. `createInsertSchema(contacts)` derives the request schema and `createSelectSchema` derives the response schema.

Env values are plain typed objects at runtime. They are parsed once, in `scripts/pre-dev.ts` (the `predev`/`prebuild` hook), so there is no per-request cost.

## Layout

```
src/
├── app/                     routing only: page.tsx, layout.tsx, api/contacts/route.ts
├── config/                  the only place process.env is read
├── db/                      schema.ts (tables + enums), client.ts (server-only)
└── features/
    ├── common/
    │   ├── utils/endpoint.ts                makeEndpoint + types (shared by client and server)
    │   ├── server/endpoint-handler.ts       endpoint → route handler
    │   ├── requests/call-endpoint.ts        endpoint → validated fetch
    │   ├── hooks/use-react-hook-form.ts     endpoint → form
    │   ├── errors/http-error.ts
    │   └── schemas/api-error.schema.ts
    └── contacts/
        ├── schemas/         contact.schema.ts, contact.endpoints.ts
        ├── queries/         server-only DB access
        └── components/      form, list
tests/                       mirrors src/
```
