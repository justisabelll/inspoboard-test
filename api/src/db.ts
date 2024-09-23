import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

const categoryTable = sqliteTable('category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

const insportationTable = sqliteTable('insportation', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categoryTable.id),
});

// export type DatabaseUser = typeof userTable.$inferSelect;

export type Category = typeof categoryTable.$inferSelect;
export type Insportation = typeof insportationTable.$inferSelect;

// export { db, categoryTable, insportationTable };
