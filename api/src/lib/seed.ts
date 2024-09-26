import { db, insportationTable, categoryTable } from '../db';
import { Database } from 'bun:sqlite';

const setup = async () => {
  const db = new Database('sqlite.db');
  db.run(`
      CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS insportation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
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
  await db.insert(insportationTable).values([
    {
      content: 'https://placehold.co/600x400',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The only way to do great work is to love what you do.',
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
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "Believe you can and you're halfway there.",
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'Stay hungry, stay foolish.',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
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
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "It always seems impossible until it's done.",
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
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
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The best way to predict the future is to invent it.',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
  ]);
};

console.log('🌱 Setting up database... 🌱');
setup();
console.log('🌱 Seeding in progress... 🌱');
seed();
console.log('Seeding completed successfully! ✅');
