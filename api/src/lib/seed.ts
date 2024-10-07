import { db, inspirationTable, categoryTable, userTable } from '../db';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { unlinkSync, existsSync } from 'node:fs';

const main = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case '--setup':
      console.log('Setting up database...');
      await setup();
      break;
    case '--reset':
      console.log('Removing all rows...');
      await reset();
      console.log('Database purged successfully! ✅');
      break;
    case '--seed':
      console.log('Seeding in progress...');
      await seed();
      break;
    case '--delete':
      console.log('Deleting database...');
      await deleteDb();
      console.log('Database deleted successfully! ✅');
      break;
    default:
      console.log(
        'Invalid command. Please use one of the following commands: --setup, --reset, --seed'
      );
      break;
  }
};

const setup = async () => {
  const dbPath = './sqlite.db';

  if (existsSync(dbPath)) {
    console.log('Database already exists. Skipping setup.');
    return;
  }

  console.log('Setting up database...');
  const sqlite = new Database(dbPath);
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS inspiration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      source TEXT,
      created_at INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES category(id)
    );
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  console.log('Database setup successfully.');
};

const seed = async () => {
  const sqlite = new Database(process.env.DATABASE_URL);
  const db = drizzle(sqlite);

  // Check if there's any data in the database
  const existingCategories = await db.select().from(categoryTable).all();
  const existingInspirations = await db.select().from(inspirationTable).all();

  if (existingCategories.length > 0 || existingInspirations.length > 0) {
    console.log('Database already contains data. Skipping seed operation.');
    return;
  }

  // If no data exists, proceed with seeding
  console.log('Seeding database...');

  // Insert categories
  await db
    .insert(categoryTable)
    .values([{ name: 'video' }, { name: 'image' }, { name: 'quote' }]);

  // Get category IDs
  const categories = await db.select().from(categoryTable).all();
  const videoCategoryId = categories.find((c) => c.name === 'video')?.id;
  const imageCategoryId = categories.find((c) => c.name === 'image')?.id;
  const quoteCategoryId = categories.find((c) => c.name === 'quote')?.id;

  // Insert inspirations
  await db.insert(inspirationTable).values([
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The only way to do great work is to love what you do.',
      source: 'Steve Jobs',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "Believe you can and you're halfway there.",
      source: 'Theodore Roosevelt',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'Stay hungry, stay foolish.',
      source: 'Steve Jobs',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content:
        'The future belongs to those who believe in the beauty of their dreams.',
      source: 'Eleanor Roosevelt',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "It always seems impossible until it's done.",
      source: 'Nelson Mandela',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The best way to predict the future is to invent it.',
      source: 'Alan Kay',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
  ]);

  console.log('Database seeded successfully.');
};

const reset = async () => {
  const sqlite = new Database(process.env.DATABASE_URL);
  const db = drizzle(sqlite);

  await db.delete(inspirationTable);
  await db.delete(categoryTable);
  await db.delete(userTable);

  sqlite.run(`
    DROP TABLE IF EXISTS category;
    DROP TABLE IF EXISTS inspiration;
    DROP TABLE IF EXISTS user;
  `);
};

const deleteDb = async () => {
  const path = './sqlite.db';
  unlinkSync(path);
};

main();
