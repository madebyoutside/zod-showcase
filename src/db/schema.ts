import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contactRole = pgEnum("contact_role", ["lead", "customer", "partner"]);

export const contacts = pgTable("contacts", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: contactRole().notNull().default("lead"),
  age: integer(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type Contact = typeof contacts.$inferSelect;
export type ContactRole = (typeof contactRole.enumValues)[number];
