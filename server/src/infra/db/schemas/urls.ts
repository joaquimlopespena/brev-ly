import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const link_shorteners = pgTable("link_shorteners", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  count_access: integer("count_access").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
