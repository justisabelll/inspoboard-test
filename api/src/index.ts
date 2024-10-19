import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { setCookie } from 'hono/cookie';
import { jwt, sign } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { createRouteHandler } from 'uploadthing/server';
import { db, inspirationTable, categoryTable } from './db';
import { uploadRouter } from './lib/uploadthing';
import type { JwtVariables } from 'hono/jwt';
import sharp from 'sharp';

type Variables = JwtVariables;

// Constants
const PORT = 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL as string;
const API_JWT_SECRET = process.env.API_JWT_SECRET;

if (
  !API_JWT_SECRET ||
  !FRONTEND_ORIGIN ||
  !process.env.SITEOWNER_USERNAME ||
  !process.env.SITEOWNER_PASSWORD
) {
  throw new Error('Missing environment variables');
}

// App initialization
const app = new Hono<{
  Variables: Variables;
}>();

// Middleware
app.use(
  cors({
    origin: [FRONTEND_ORIGIN],
    credentials: true,
  })
);

app.use(
  '/protected/*',
  jwt({
    secret: API_JWT_SECRET,
    cookie: 'auth-token',
  })
);

// Route handlers
const getItems = async (c: any) =>
  c.json(await db.select().from(inspirationTable).all());

const getCategories = async (c: any) =>
  c.json(await db.select().from(categoryTable).all());

const addItem = async (c: any) => {
  const { item } = c.req.valid('json');
  try {
    await db.insert(inspirationTable).values({
      content: item.content,
      category_id: item.category.id,
      source: item.source ?? null,
      created_at: new Date(),
    });
    return c.json({ message: 'Item added successfully' }, 200);
  } catch (error) {
    console.error('Error adding item:', error);
    return c.json({ message: 'Error adding item' }, 500);
  }
};

const deleteItem = async (c: any) => {
  const id = c.req.param('id');
  try {
    await db
      .delete(inspirationTable)
      .where(eq(inspirationTable.id, parseInt(id)));
    return c.json({ message: 'Item deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting item:', error);
    return c.json({ message: 'Error deleting item' }, 500);
  }
};

const login = async (c: any) => {
  const { username, password } = await c.req.json();

  if (
    username === process.env.SITEOWNER_USERNAME &&
    password === process.env.SITEOWNER_PASSWORD
  ) {
    const token = await sign({ username }, API_JWT_SECRET);
    setCookie(c, 'auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return c.json({ message: 'Logged in successfully' }, 200);
  }
  return c.json({ message: 'Invalid credentials' }, 401);
};

const logout = (c: any) => {
  setCookie(c, 'auth-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0,
    path: '/',
  });
  return c.json({ message: 'Logged out successfully' }, 200);
};

// Function to optimize an image
const optimizeImage = async (c: any) => {
  // Get the uploaded file from the request
  const file = await c.req.file();
  if (!file) return c.json({ error: 'No file provided' }, 400);

  // Convert the file to an array buffer
  const buffer = await file.arrayBuffer();

  // Optimize the image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // Resize the image to fit within 1200x1200 pixels
    .webp({ quality: 95, lossless: false, nearLossless: true }) // Convert the image to WebP format with specified quality settings
    .toBuffer();

  // Create a new file with the optimized image buffer
  const optimizedFile = new File(
    [optimizedBuffer],
    `${file.name.split('.')[0]}_optimized.webp`,
    {
      type: 'image/webp',
    }
  );

  // Return the optimized file in the response
  return c.body(optimizedFile, 200, {
    'Content-Type': 'image/webp',
    'Content-Disposition': `attachment; filename="${
      file.name.split('.')[0]
    }_optimized.webp"`,
  });
};

// UploadThing handler
const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: { token: process.env.UPLOADTHING_TOKEN },
});

// Routes
const itemsRoute = app.get('/items', getItems);
const categoriesRoute = app.get('/categories', getCategories);
const deleteItemRoute = app.delete('/protected/delete-item/:id', deleteItem);

const addItemRoute = app.post(
  '/protected/new-items',
  zValidator(
    'json',
    z.object({
      item: z.object({
        content: z.string().min(1, { message: 'Content is required' }),
        category: z.object({
          id: z.number().min(1, { message: 'Category ID is required' }),
          name: z.string().min(1, { message: 'Category name is required' }),
        }),
        source: z.string().optional(),
      }),
    })
  ),
  addItem
);

app.post('/login', login);
app.post('/logout', logout);

app.get('/protected/auth-check', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ message: 'This is protected', payload });
});

app.post('/protected/optimize-image', optimizeImage);
app.all('/uploadthing', (c) => uploadthingHandler(c.req.raw));

// Start the server
console.log(`Hono 🔥 running on port ${PORT}`);

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

export type AppRouter = typeof addItemRoute &
  typeof deleteItemRoute &
  typeof itemsRoute &
  typeof categoriesRoute;

export default app;
