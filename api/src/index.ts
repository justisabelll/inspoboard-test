import { zValidator } from '@hono/zod-validator';
import type { JwtVariables } from 'hono/jwt';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';
import { Hono } from 'hono';
import { z } from 'zod';

type Variables = JwtVariables;

const JWT_SECRET = '';

const app = new Hono<{
  Variables: Variables;
}>();

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

app.use(
  '/protected/*',
  jwt({
    secret: JWT_SECRET,
  })
);

app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (username === 'admin' && password === 'admin') {
    const token = await sign({ username }, JWT_SECRET);
    return c.json({ token }, 200);
  }
  return c.json({ message: 'Invalid credentials' }, 401);
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/api/protected', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ message: 'This is protected', username: payload.username });
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

const addItemRoute = app.post('/protected/new-items', async (c) => {
  const { item } = await c.req.json();
  tempData.push(item);
  return c.json(tempData);
});

export type AppRouter = typeof helloRoute &
  typeof itemsRoute &
  typeof addItemRoute;

export default app;

console.log('Hono running on port 3000');
