import { db, inspirationTable, categoryTable } from '../db';
import { Database } from 'bun:sqlite';

const main = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case '--setup':
      console.log('Setting up database...');
      await setup();
      console.log('Database setup successfully! ✅');
      break;
    case '--reset':
      console.log('Removing all rows...');
      await reset();
      console.log('Database purged successfully! ✅');
      break;
    case '--seed':
      console.log('Seeding in progress...');
      await seed();
      console.log('Seeding completed successfully! ✅');
      break;
    default:
      console.log(
        'Invalid command. Please use one of the following commands: --setup, --reset, --seed'
      );
      break;
  }
};

const setup = async () => {
  const db = new Database('sqlite.db');
  db.run(`
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
};

const seed = async () => {
  // Insert categories
  await db
    .insert(categoryTable)
    .values([{ name: 'video' }, { name: 'image' }, { name: 'quote' }]);

  // Get category IDs
  const categories = await db.select().from(categoryTable).all();
  const videoCategoryId = categories.find((c) => c.name === 'video')?.id;
  const imageCategoryId = categories.find((c) => c.name === 'image')?.id;
  const quoteCategoryId = categories.find((c) => c.name === 'quote')?.id;

  // Insert insportations
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
};

const reset = async () => {
  await db.delete(inspirationTable);
  await db.delete(categoryTable).returning();

  const bunDB = new Database('sqlite.db');
  bunDB.run(`DROP TABLE IF EXISTS category;
  DROP TABLE IF EXISTS inspiration;
  DROP TABLE IF EXISTS user;
  `);
};

main();
