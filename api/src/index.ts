import { zValidator } from '@hono/zod-validator';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

const tempData = [
  { type: 'image', content: 'https://placehold.co/600x400' },
  {
    type: 'quote',
    content: 'The only way to do great work is to love what you do.',
  },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: "Believe you can and you're halfway there." },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: 'Stay hungry, stay foolish.' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  {
    type: 'quote',
    content:
      'The future belongs to those who believe in the beauty of their dreams.',
  },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: "It always seems impossible until it's done." },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  {
    type: 'quote',
    content: 'The best way to predict the future is to invent it.',
  },
];

app.use(
  cors({
    origin: 'http://localhost:5174',
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const helloRoute = app.post(
  '/hello',
  zValidator(
    'json',
    z.object({
      name: z.string().min(1, { message: 'Name is required' }),
    })
  ),
  (c) => {
    const { name } = c.req.valid('json');
    return c.json({ message: `Hello ${name}` }, 200);
  }
);

const itemsRoute = app.get('/items', (c) => {
  return c.json(tempData);
});

export type AppRouter = typeof helloRoute & typeof itemsRoute;
