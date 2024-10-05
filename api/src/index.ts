import { zValidator } from '@hono/zod-validator';
import type { JwtVariables } from 'hono/jwt';
import { jwt, sign } from 'hono/jwt';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { db, inspirationTable } from './db';
import { z } from 'zod';
import { setCookie } from 'hono/cookie';

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
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
  })
);

// app.use(
//   '/protected/*',
//   jwt({
//     secret: JWT_SECRET as string,
//     cookie: 'auth-token', // Look for the token in the 'auth-token' cookie
//   })
// );

app.use(
  '/protected/*',
  jwt({
    secret: JWT_SECRET,
    cookie: 'auth-token', // Look for the token in the 'auth-token' cookie
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
  return c.json(await db.select().from(inspirationTable).all());
});

app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (username === 'admin' && password === 'admin') {
    const token = await sign({ username }, JWT_SECRET as string);

    // Set the token as an httpOnly cookie
    setCookie(c, 'auth-token', token, {
      httpOnly: true,
      secure: true, // Use this in production
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return c.json({ message: 'Logged in successfully' }, 200);
  }
  return c.json({ message: 'Invalid credentials' }, 401);
});

app.get('/protected/auth-check', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ message: 'This is protected', payload });
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
      await db.insert(inspirationTable).values({
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

// Add a logout route
app.post('/logout', (c) => {
  setCookie(c, 'auth-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0,
    path: '/',
  });
  return c.json({ message: 'Logged out successfully' }, 200);
});

export type AppRouter = typeof helloRoute &
  typeof itemsRoute &
  typeof addItemRoute;

export default app;

console.log('Hono 🔥 running on port 3000');
