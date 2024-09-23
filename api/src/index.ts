import { zValidator } from '@hono/zod-validator';
import type { JwtVariables } from 'hono/jwt';
import { jwt, sign } from 'hono/jwt';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { db, insportationTable } from './db';
import { z } from 'zod';

type Variables = JwtVariables;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

const app = new Hono<{
  Variables: Variables;
}>();

app.use(
  cors({
    origin: 'http://localhost:5174',
  })
);

app.use(
  '/protected/*',
  jwt({
    secret: JWT_SECRET as string,
  })
);

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

const itemsRoute = app.get('/items', async (c) => {
  return c.json(await db.select().from(insportationTable).all());
});

app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (username === 'admin' && password === 'admin') {
    const token = await sign({ username }, JWT_SECRET as string);
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

const addItemRoute = app.post(
  '/protected/new-items',
  zValidator(
    'json',
    z.object({
      content: z.string().min(1, { message: 'Content is required' }),
      category_id: z.number().min(1, { message: 'Category ID is required' }),
    })
  ),
  async (c) => {
    const { content, category_id } = c.req.valid('json');

    try {
      await db.insert(insportationTable).values({
        content: content,
        category_id: category_id,
        created_at: new Date(),
      });
      return c.json({ message: 'Item added' }, 200);
    } catch (error) {
      return c.json({ message: 'Error adding item' }, 500);
    }
  }
);

export type AppRouter = typeof helloRoute &
  typeof itemsRoute &
  typeof addItemRoute;

export default app;

console.log('Hono running on port 3000');
