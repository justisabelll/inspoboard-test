import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const sqlite = new Database('./sqlite.db');
const db = drizzle(sqlite);

const categoryTable = sqliteTable('category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

const inspirationTable = sqliteTable('inspiration', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  source: text('source'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categoryTable.id),
});

const userTable = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  password: text('password').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// export type DatabaseUser = typeof userTable.$inferSelect;

export type CategorySelectType = typeof categoryTable.$inferSelect;
export type InspirationSelectType = typeof inspirationTable.$inferSelect;
export type UserSelectType = typeof userTable.$inferSelect;

export type CategoryInsertType = typeof categoryTable.$inferInsert;
export type InspirationInsertType = typeof inspirationTable.$inferInsert;
export type UserInsertType = typeof userTable.$inferInsert;

export { db, categoryTable, inspirationTable, userTable };
