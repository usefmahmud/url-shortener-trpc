import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: serial().primaryKey(),
  url: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
